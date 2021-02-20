import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: ClienteListComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
