import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { PrincipalRoutingModule } from './principal-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MenuComponent } from './menu/menu.component';
import { SidenavComponent } from './menu/sidenav/sidenav.component';
import { BaseComponent } from './menu/base/base.component';
import { CuentaComponent } from './menu/cuenta/cuenta.component';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { httpInterceptorProviders } from '../http-interceptors/index';

@NgModule({
  declarations: [MenuComponent, SidenavComponent, BaseComponent, CuentaComponent],
  imports: [
    SharedModule,
    PrincipalRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    HttpErrorHandlerService,
    httpInterceptorProviders
  ]
})
export class PrincipalModule { }