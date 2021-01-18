import { NgModule } from '@angular/core';
import { PrincipalRoutingModule } from './principal-routing.module';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MenuComponent } from './menu/menu.component';
import { SidenavComponent } from './menu/sidenav/sidenav.component';
import { BaseComponent } from './menu/base/base.component';
import { HttpErrorHandlerService } from '../http-error-handler.service';
import { httpInterceptorProviders } from '../http-interceptors/index';

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
    MatListModule,
    MatDividerModule
  ],
  providers: [
    HttpErrorHandlerService,
    httpInterceptorProviders
  ]
})
export class PrincipalModule { }