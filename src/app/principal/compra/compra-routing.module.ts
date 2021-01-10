import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompraListComponent } from './compra-list/compra-list.component';
import { CompraDetailComponent } from './compra-detail/compra-detail.component';
import { RolGuard } from 'src/app/auth/rol.guard';

const routes: Routes = [
  {
    path: '',
    component: CompraListComponent,
    canActivate: [RolGuard]
  },
  { 
    path: 'compra', 
    component: CompraDetailComponent,
    canActivate: [RolGuard]
  },
  { 
    path: 'compra/:id', 
    component: CompraDetailComponent,
    canActivate: [RolGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompraRoutingModule { }