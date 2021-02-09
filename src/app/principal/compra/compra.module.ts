import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompraRoutingModule } from './compra-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CompraListComponent } from './compra-list/compra-list.component';
import { CompraDetailComponent } from './compra-detail/compra-detail.component';


@NgModule({
  declarations: [CompraListComponent, CompraDetailComponent],
  imports: [
    SharedModule,
    CompraRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class CompraModule { }
