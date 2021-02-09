import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorDetailComponent } from './proveedor-list/proveedor-detail/proveedor-detail.component';


@NgModule({
  declarations: [ProveedorListComponent, ProveedorDetailComponent],
  imports: [
    SharedModule,
    ProveedorRoutingModule,
    MatSlideToggleModule
  ]
})
export class ProveedorModule { }
