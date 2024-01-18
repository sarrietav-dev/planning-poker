import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from 'src/app/components/atoms/button/button.component';
import { AvatarComponent } from '../../components/atoms/avatar/avatar.component';
import { CardComponent } from '../../components/atoms/card/card.component';
import { DialogComponent } from '../../components/atoms/dialog/dialog.component';
import { CardDeckModalComponent } from './components/card-deck-modal/card-deck-modal.component';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { DeskComponent } from './components/desk/desk.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchResultsDialogComponent } from './components/match-results-dialog/match-results-dialog.component';
import { MatchResultsComponent } from './components/match-results/match-results.component';
import { NavComponent } from './components/nav/nav.component';
import { MatchRoutingModule } from './match-routing.module';
import { MatchComponent } from './match.component';
import { FormatCardValuePipe } from './pipes/format-card-value.pipe';
import { FormatVotePipe } from './pipes/format-vote.pipe';

@NgModule({
  declarations: [
    JoinDialogComponent,
    MatchComponent,
    DeskComponent,
    InviteDialogComponent,
    CardDeckComponent,
    CardDeckModalComponent,
    NavComponent,
    MatchResultsComponent,
    FormatVotePipe,
    MatchResultsDialogComponent,
    FormatCardValuePipe
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
    MatMenuModule
  ],
})
export class MatchModule {}
