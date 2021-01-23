import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { RepuestoRoutingModule } from './repuesto-routing.module';
import { RepuestoListComponent } from './repuesto-list/repuesto-list.component';
import { RepuestoDetailComponent } from './repuesto-list/repuesto-detail/repuesto-detail.component';
import { RepuestoPrintComponent } from './repuesto-list/repuesto-print/repuesto-print.component';


@NgModule({
  declarations: [RepuestoListComponent, RepuestoDetailComponent, RepuestoPrintComponent],
  imports: [
    SharedModule,
    RepuestoRoutingModule,
    MatSelectModule
  ]
})
export class RepuestoModule { }
