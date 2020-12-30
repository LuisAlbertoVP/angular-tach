import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { PrincipalRoutingModule } from './principal-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { CategoriaModule } from './categoria/categoria.module';
import { MarcaModule } from './marca/marca.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { RepuestoModule } from './repuesto/repuesto.module';
import { CompraModule } from './compra/compra.module';
import { VentaModule } from './venta/venta.module';
import { MenuComponent } from './menu/menu.component';
import { SidenavComponent } from './menu/sidenav/sidenav.component';
import { BaseComponent } from './menu/base/base.component';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { httpInterceptorProviders } from '../http-interceptors/index';

@NgModule({
  declarations: [MenuComponent, SidenavComponent, BaseComponent],
  imports: [
    SharedModule,
    PrincipalRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    UsuarioModule,
    RolModule,
    ProveedorModule,
    MarcaModule,
    CategoriaModule,
    RepuestoModule,
    CompraModule,
    VentaModule
  ],
  providers: [
    HttpErrorHandlerService,
    httpInterceptorProviders
  ]
})
export class PrincipalModule { }