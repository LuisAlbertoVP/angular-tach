import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogConfirm, VentaDetailComponent } from './venta-detail/venta-detail.component';
import { VentaListComponent } from './venta-list/venta-list.component';
import { RepuestoVentaComponent } from './venta-detail/repuesto-venta/repuesto-venta.component';


@NgModule({
  declarations: [VentaDetailComponent, VentaListComponent, DialogConfirm, RepuestoVentaComponent],
  imports: [
    SharedModule,
    VentaRoutingModule,
    MatRadioModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class VentaModule { }
