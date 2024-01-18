import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMatchFormComponent } from './pages/create/create-match-form.component';
import { MatchGuard } from './guards/match/match.guard';
import { matchLeaveGuard } from './guards/match-leave/match-leave.guard';

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
      import('./pages/match/match.module').then((m) => m.MatchModule),
    canActivate: [MatchGuard],
    canDeactivate: [matchLeaveGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
