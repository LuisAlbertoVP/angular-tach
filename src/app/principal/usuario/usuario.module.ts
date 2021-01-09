import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioDetailComponent } from './usuario-list/usuario-detail/usuario-detail.component';


@NgModule({
  declarations: [UsuarioListComponent, UsuarioDetailComponent],
  imports: [
    SharedModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
