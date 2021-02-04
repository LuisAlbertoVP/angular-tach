import { NgModule } from '@angular/core';
import { TransaccionSharedModule } from '@shared/transaccion-shared/transaccion-shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';
import { VentaListComponent } from './venta-list/venta-list.component';


@NgModule({
  declarations: [VentaDetailComponent, VentaListComponent],
  imports: [
    TransaccionSharedModule,
    VentaRoutingModule
  ]
})
export class VentaModule { }
