import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteDetailComponent } from './reporte-detail/reporte-detail.component'

const routes: Routes = [
  {
    path: '',
    component: ReporteDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteRoutingModule { }
