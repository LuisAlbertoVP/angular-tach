import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { VentaDetailComponent } from './venta-detail/venta-detail.component';
import { VentaListComponent } from './venta-list/venta-list.component';


@NgModule({
  declarations: [VentaDetailComponent, VentaListComponent],
  imports: [
    SharedModule,
    VentaRoutingModule,
    MatRadioModule,
    MatSelectModule
  ]
})
export class VentaModule { }
