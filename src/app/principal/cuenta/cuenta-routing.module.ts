import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CuentaDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaRoutingModule { }
