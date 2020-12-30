import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';
import { VentaListComponent } from './venta-list/venta-list.component';


@NgModule({
  declarations: [VentaDetailComponent, VentaListComponent],
  imports: [
    SharedModule
  ]
})
export class VentaModule { }
