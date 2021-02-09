import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioDetailComponent } from './usuario-list/usuario-detail/usuario-detail.component';


@NgModule({
  declarations: [UsuarioListComponent, UsuarioDetailComponent],
  imports: [
    SharedModule,
    UsuarioRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class UsuarioModule { }
