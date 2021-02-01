import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { BaseComponent } from './menu/base/base.component';
import { AuthGuard } from '../auth/auth.guard';
import { RolGuard } from '../auth/rol.guard';

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
          { 
            path: '', component: BaseComponent 
          },
          { 
            path: 'cuenta', loadChildren: () => import('./cuenta/cuenta.module').then(m => m.CuentaModule) 
          },
          { 
            path: 'sistema', loadChildren: () => import('./sistema/sistema.module').then(m => m.SistemaModule) 
          },
          { 
            path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule) 
          },
          { 
            path: 'usuarios', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), 
            canLoad: [RolGuard], data: { modulo: 'Usuarios'} 
          },
          {
            path: 'roles', loadChildren: () => import('./rol/rol.module').then(m => m.RolModule), 
            canLoad: [RolGuard], data: { modulo: 'Roles'} 
          },
          { 
            path: 'proveedores', loadChildren: () => import('./proveedor/proveedor.module').then(m => m.ProveedorModule), 
            canLoad: [RolGuard], data: { modulo: 'Proveedores'} 
          },
          { 
            path: 'marcas', loadChildren: () => import('./marca/marca.module').then(m => m.MarcaModule), 
            canLoad: [RolGuard], data: { modulo: 'Marcas'} 
          },
          { 
            path: 'categorias', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule), 
            canLoad: [RolGuard], data: { modulo: 'Categorias'} 
          },
          { 
            path: 'repuestos', loadChildren: () => import('./repuesto/repuesto.module').then(m => m.RepuestoModule), 
            canLoad: [RolGuard], data: { modulo: 'Repuestos'} 
          },
          { 
            path: 'compras', loadChildren: () => import('./compra/compra.module').then(m => m.CompraModule), 
            canLoad: [RolGuard], data: { modulo: 'Compras'} 
          },
          { 
            path: 'ventas', loadChildren: () => import('./venta/venta.module').then(m => m.VentaModule), 
            canLoad: [RolGuard], data: { modulo: 'Ventas'} 
          }
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
