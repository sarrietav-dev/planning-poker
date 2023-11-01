import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateMatchFormComponent } from './create-match-form/create-match-form.component';
import { CreateMatchRoutingModule } from './create-match-routing.module';



@NgModule({
  declarations: [
    CreateMatchFormComponent
  ],
  imports: [
    CommonModule,
    CreateMatchRoutingModule
  ]
})
export class CreateMatchModule { }
