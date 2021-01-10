import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaListComponent } from './venta-list/venta-list.component';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: VentaListComponent,
    canActivate: [RolGuard]
  },
  { 
    path: 'venta', 
    component: VentaDetailComponent,
    canActivate: [RolGuard]
  },
  { 
    path: 'venta/:id', 
    component: VentaDetailComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaRoutingModule { }