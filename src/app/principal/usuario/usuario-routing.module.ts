import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: UsuarioListComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }