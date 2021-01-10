import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CuentaRoutingModule } from './cuenta-routing.module';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';


@NgModule({
  declarations: [CuentaDetailComponent],
  imports: [
    SharedModule,
    CuentaRoutingModule
  ]
})
export class CuentaModule { }
