import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, EMPTY } from 'rxjs';
import { AvatarComponent } from 'src/app/components/atoms/avatar/avatar.component';
import { ButtonComponent } from 'src/app/components/atoms/button/button.component';
import { MatchService } from 'src/app/services/match/match.service';
import { CommonModule } from '@angular/common';
import { State } from 'src/app/store';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MatchService', [
      'joinMatch',
      'createMatch',
      'cardDeck$',
      'getSpectators',
      'getAreCardsRevealed',
    ]) as jasmine.SpyObj<MatchService>;

    serviceSpy.getSpectators.and.returnValue(
      of([
        { name: 'hey', id: '' },
        { name: 'whats', id: '' },
        { name: 'up', id: '' },
        { name: 'bro', id: '' },
      ]),
    );

    serviceSpy.getAreCardsRevealed.and.returnValue(of(false));

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    storeSpy.select.and.callFake(() => EMPTY);
    serviceSpy.cardDeck$.and.callFake(() => EMPTY);

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    routeSpy.snapshot = {
      paramMap: {
        get: () => '1',
      },
    };

    TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [ButtonComponent, AvatarComponent, CommonModule],
      providers: [
        { provide: MatchService, useValue: serviceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    });

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a list of three spectators', (done) => {
    component.getSpectators$().subscribe((spectators) => {
      expect(spectators.length).toBe(3);
      done();
    });
  });

  it('should return a spectator count label', () => {
    expect(component.spectatorCountLabel).toBe('1+');
  });

  it('should emit inviteModalOpenChange', () => {
    spyOn(component.isInviteModalOpenChange, 'emit');
    component.handleInviteModalOpen();
    expect(component.isInviteModalOpenChange.emit).toHaveBeenCalledWith(true);
  });

  it('should select name from match in store', (done) => {
    const expectedMatch = {
      match: {
        name: 'Test Match',
        cardDeck: [],
        id: '',
        players: [],
        spectators: [],
      },
      isAdmin: true,
      areCardsRevealed: true,
    } satisfies State;
    component.match$ = of(expectedMatch);

    component.name$.subscribe((name) => {
      expect(name).toEqual(expectedMatch.match.name);
      done();
    });
  });
});
