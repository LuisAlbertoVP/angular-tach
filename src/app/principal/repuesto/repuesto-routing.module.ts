import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepuestoListComponent } from './repuesto-list/repuesto-list.component';
import { RepuestoPrintComponent } from './repuesto-list/repuesto-print/repuesto-print.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: RepuestoListComponent,
    canActivate: [RolGuard],
    children: [
      { path: 'print', component: RepuestoPrintComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepuestoRoutingModule { }