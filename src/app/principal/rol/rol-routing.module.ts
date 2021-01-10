import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolListComponent } from './rol-list/rol-list.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: RolListComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolRoutingModule { }