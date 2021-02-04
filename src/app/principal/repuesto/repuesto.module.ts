import { NgModule } from '@angular/core';
import { GeneralSharedModule } from '@shared/general-shared/general-shared.module';
import { MatSelectModule } from '@angular/material/select';
import { RepuestoRoutingModule } from './repuesto-routing.module';
import { RepuestoListComponent } from './repuesto-list/repuesto-list.component';
import { RepuestoDetailComponent } from './repuesto-list/repuesto-detail/repuesto-detail.component';
import { RepuestoPrintComponent } from './repuesto-list/repuesto-print/repuesto-print.component';


@NgModule({
  declarations: [RepuestoListComponent, RepuestoDetailComponent, RepuestoPrintComponent],
  imports: [
    GeneralSharedModule,
    RepuestoRoutingModule,
    MatSelectModule
  ]
})
export class RepuestoModule { }
