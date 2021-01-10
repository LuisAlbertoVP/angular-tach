import { NgModule } from '@angular/core';
import { PrincipalRoutingModule } from './principal-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MenuComponent } from './menu/menu.component';
import { SidenavComponent } from './menu/sidenav/sidenav.component';
import { BaseComponent } from './menu/base/base.component';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { httpInterceptorProviders } from '../http-interceptors/index';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MenuComponent, SidenavComponent, BaseComponent],
  imports: [
    CommonModule,
    PrincipalRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    HttpErrorHandlerService,
    httpInterceptorProviders
  ]
})
export class PrincipalModule { }