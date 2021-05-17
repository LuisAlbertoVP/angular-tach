import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RepuestoRoutingModule } from './repuesto-routing.module';
import { RepuestoListComponent } from './repuesto-list/repuesto-list.component';
import { RepuestoDetailComponent } from './repuesto-list/repuesto-detail/repuesto-detail.component';
import { RepuestoPrintComponent } from './repuesto-list/repuesto-print/repuesto-print.component';
import { RepuestoReporteComponent } from './repuesto-list/repuesto-reporte/repuesto-reporte.component';
import { PrintContextComponent } from './repuesto-list/repuesto-print/print-context/print-context.component';


@NgModule({
  declarations: [RepuestoListComponent, RepuestoDetailComponent, RepuestoPrintComponent, RepuestoReporteComponent, PrintContextComponent],
  imports: [
    SharedModule,
    RepuestoRoutingModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class RepuestoModule { }
