import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RolGuard } from '../auth/rol.guard';
import { MenuComponent } from './menu/menu.component';
import { BaseComponent } from './menu/base/base.component';
import { CuentaComponent } from './menu/cuenta/cuenta.component';
import { UsuarioListComponent } from './usuario/usuario-list/usuario-list.component';
import { RolListComponent } from './rol/rol-list/rol-list.component';
import { ProveedorListComponent } from './proveedor/proveedor-list/proveedor-list.component';
import { MarcaListComponent } from './marca/marca-list/marca-list.component';
import { CategoriaListComponent } from './categoria/categoria-list/categoria-list.component';
import { RepuestoListComponent } from './repuesto/repuesto-list/repuesto-list.component';
import { RepuestoPrintComponent } from './repuesto/repuesto-list/repuesto-print/repuesto-print.component';
import { CompraListComponent } from './compra/compra-list/compra-list.component';
import { CompraDetailComponent } from './compra/compra-detail/compra-detail.component';
import { VentaListComponent } from './venta/venta-list/venta-list.component';
import { VentaDetailComponent } from './venta/venta-detail/venta-detail.component';

const routes: Routes = [
  {
    path: '',  
    component: MenuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: '', component: BaseComponent },
          { path: 'cuenta', component: CuentaComponent },
          { path: 'usuarios', component: UsuarioListComponent, canActivate: [RolGuard], data: { modulo: 'Usuarios'} },
          { path: 'roles', component: RolListComponent, canActivate: [RolGuard], data: { modulo: 'Roles'} },
          { path: 'proveedores', component: ProveedorListComponent, canActivate: [RolGuard], data: { modulo: 'Proveedores'} },
          { path: 'marcas', component: MarcaListComponent, canActivate: [RolGuard], data: { modulo: 'Marcas'} },
          { path: 'categorias', component: CategoriaListComponent, canActivate: [RolGuard], data: { modulo: 'Categorias'} },
          { path: 'repuestos', component: RepuestoListComponent, canActivate: [RolGuard], data: { modulo: 'Repuestos'},
            children: [
              { path: 'print', component: RepuestoPrintComponent }
            ]
          },
          { path: 'compras', component: CompraListComponent, canActivate: [RolGuard], data: { modulo: 'Compras'} },
          { path: 'compra', component: CompraDetailComponent, canActivate: [RolGuard], data: { modulo: 'Compras'} },
          { path: 'compra/:id', component: CompraDetailComponent, canActivate: [RolGuard], data: { modulo: 'Compras'} },
          { path: 'ventas', component: VentaListComponent, canActivate: [RolGuard], data: { modulo: 'Ventas'} },
          { path: 'venta', component: VentaDetailComponent, canActivate: [RolGuard], data: { modulo: 'Ventas'} },
          { path: 'venta/:id', component: VentaDetailComponent, canActivate: [RolGuard], data: { modulo: 'Ventas'} }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
