import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorDetailComponent } from './proveedor-list/proveedor-detail/proveedor-detail.component';


@NgModule({
  declarations: [ProveedorListComponent, ProveedorDetailComponent],
  imports: [
    SharedModule
  ]
})
export class ProveedorModule { }
