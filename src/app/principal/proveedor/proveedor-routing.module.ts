import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: ProveedorListComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }