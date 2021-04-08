import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorDetailComponent } from './proveedor-list/proveedor-detail/proveedor-detail.component';


@NgModule({
  declarations: [ProveedorListComponent, ProveedorDetailComponent],
  imports: [
    SharedModule,
    ProveedorRoutingModule
  ]
})
export class ProveedorModule { }
