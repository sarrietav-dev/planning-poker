import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchFormComponent } from './create-match-form/create-match-form.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateMatchFormComponent,
  },
  {
    path: '',
    redirectTo: '/create',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
