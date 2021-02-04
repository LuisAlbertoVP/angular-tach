import { NgModule } from '@angular/core';
import { TransaccionSharedModule } from '@shared/transaccion-shared/transaccion-shared.module';
import { CompraRoutingModule } from './compra-routing.module';
import { CompraListComponent } from './compra-list/compra-list.component';
import { CompraDetailComponent } from './compra-detail/compra-detail.component';


@NgModule({
  declarations: [CompraListComponent, CompraDetailComponent],
  imports: [
    TransaccionSharedModule,
    CompraRoutingModule
  ]
})
export class CompraModule { }
