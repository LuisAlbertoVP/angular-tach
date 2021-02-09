import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';
import { VentaListComponent } from './venta-list/venta-list.component';


@NgModule({
  declarations: [VentaDetailComponent, VentaListComponent],
  imports: [
    SharedModule,
    VentaRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class VentaModule { }
