import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SistemaDetailComponent } from './sistema-detail/sistema-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SistemaDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
