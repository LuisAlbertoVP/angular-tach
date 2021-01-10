import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarcaListComponent } from './marca-list/marca-list.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: MarcaListComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcaRoutingModule { }