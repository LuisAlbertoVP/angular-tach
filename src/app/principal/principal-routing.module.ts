import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RolGuard } from '../auth/rol.guard';
import { MenuComponent } from './menu/menu.component';
import { BaseComponent } from './menu/base/base.component';
import { CuentaComponent } from './menu/cuenta/cuenta.component';

const routes: Routes = [
  {
    path: '',  
    component: MenuComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: BaseComponent },
      { path: 'cuenta', component: CuentaComponent },
      { 
        path: 'usuarios', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), 
        canActivate: [RolGuard], data: { modulo: 'Usuarios'} },
      { 
        path: 'roles', loadChildren: () => import('./rol/rol.module').then(m => m.RolModule), 
        canActivate: [RolGuard], data: { modulo: 'Roles'} },
      { 
        path: 'proveedores', loadChildren: () => import('./proveedor/proveedor.module').then(m => m.ProveedorModule), 
        canActivate: [RolGuard], data: { modulo: 'Proveedores'} },
      { 
        path: 'marcas', loadChildren: () => import('./marca/marca.module').then(m => m.MarcaModule), 
        canActivate: [RolGuard], data: { modulo: 'Marcas'} },
      { 
        path: 'categorias', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule), 
        canActivate: [RolGuard], data: { modulo: 'Categorias'} 
      },
      { 
        path: 'repuestos', loadChildren: () => import('./repuesto/repuesto.module').then(m => m.RepuestoModule), 
        canActivate: [RolGuard], data: { modulo: 'Repuestos'} 
      },
      { 
        path: 'compras', loadChildren: () => import('./compra/compra.module').then(m => m.CompraModule), 
        canActivate: [RolGuard], data: { modulo: 'Compras'} 
      },
      { 
        path: 'ventas', loadChildren: () => import('./venta/venta.module').then(m => m.VentaModule), 
        canActivate: [RolGuard], data: { modulo: 'Ventas'} 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
