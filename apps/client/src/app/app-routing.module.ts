import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchFormComponent } from './create-match-form/create-match-form.component';
import { MatchGuard } from './core/guards/match/match.guard';

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
  {
    path: 'match/:id',
    loadChildren: () =>
      import('./match/match.module').then((m) => m.MatchModule),
    canActivate: [MatchGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
