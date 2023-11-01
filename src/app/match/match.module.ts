import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchRoutingModule } from './match-routing.module';
import { JoinDialogComponent } from './components/join-dialog/join-dialog.component';
import { MatchComponent } from './match.component';


@NgModule({
  declarations: [
    JoinDialogComponent,
    MatchComponent
  ],
  imports: [
    CommonModule,
    MatchRoutingModule
  ]
})
export class MatchModule { }
