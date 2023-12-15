import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchRoutingModule } from './match-routing.module';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchComponent } from './match.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeskComponent } from './components/desk/desk.component';
import { CardComponent } from '../../components/card/card.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { InviteDialogComponent } from './components/invite-dialog/invite-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { ButtonComponent } from 'src/app/components/button/button.component';

@NgModule({
  declarations: [
    JoinDialogComponent,
    MatchComponent,
    DeskComponent,
    InviteDialogComponent,
    CardDeckComponent,
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
