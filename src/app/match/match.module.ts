import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchRoutingModule } from './match-routing.module';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchComponent } from './match.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [JoinDialogComponent, MatchComponent],
  imports: [CommonModule, MatchRoutingModule, ReactiveFormsModule],
})
export class MatchModule {}
