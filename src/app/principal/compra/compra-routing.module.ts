import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraListComponent } from './compra-list/compra-list.component';
import { CompraDetailComponent } from './compra-detail/compra-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CompraListComponent
  },
  { 
    path: 'compra', 
    component: CompraDetailComponent
  },
  { 
    path: 'compra/:id', 
    component: CompraDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraRoutingModule { }