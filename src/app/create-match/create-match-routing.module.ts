import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchFormComponent } from './create-match-form/create-match-form.component';

const routes: Routes = [{ path: '', component: CreateMatchFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMatchRoutingModule {}
