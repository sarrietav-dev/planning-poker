import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchRoutingModule } from './match-routing.module';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchComponent } from './match.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeskComponent } from './components/desk/desk.component';

@NgModule({
  declarations: [JoinDialogComponent, MatchComponent, DeskComponent],
  imports: [CommonModule, MatchRoutingModule, ReactiveFormsModule],
})
export class MatchModule {}
