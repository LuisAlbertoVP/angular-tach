import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaListComponent } from './venta-list/venta-list.component';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';

const routes: Routes = [
  {
    path: '',
    component: VentaListComponent
  },
  { 
    path: 'venta', 
    component: VentaDetailComponent
  },
  { 
    path: 'venta/:id', 
    component: VentaDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }