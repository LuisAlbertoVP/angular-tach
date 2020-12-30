import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CompraListComponent } from './compra-list/compra-list.component';
import { CompraDetailComponent } from './compra-detail/compra-detail.component';


@NgModule({
  declarations: [CompraListComponent, CompraDetailComponent],
  imports: [
    SharedModule
  ]
})
export class CompraModule { }
