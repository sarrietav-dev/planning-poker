import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchRoutingModule } from './match-routing.module';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchComponent } from './match.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeskComponent } from './components/desk/desk.component';
import { CardComponent } from '../../components/atoms/card/card.component';
import { AvatarComponent } from '../../components/atoms/avatar/avatar.component';
import { DialogComponent } from '../../components/atoms/dialog/dialog.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { ButtonComponent } from 'src/app/components/atoms/button/button.component';
import { CardDeckModalComponent } from './components/card-deck-modal/card-deck-modal.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [
    JoinDialogComponent,
    MatchComponent,
    DeskComponent,
    InviteDialogComponent,
    CardDeckComponent,
    CardDeckModalComponent,
    NavComponent,
  ],
  imports: [
    CommonModule,
    MatchRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    CardComponent,
    AvatarComponent,
    DialogComponent,
    ButtonComponent,
  ],
})
export class MatchModule {}
