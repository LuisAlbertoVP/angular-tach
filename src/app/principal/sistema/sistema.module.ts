import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { SistemaDetailComponent } from './sistema-detail/sistema-detail.component';


@NgModule({
  declarations: [SistemaDetailComponent],
  imports: [
    CommonModule,
    SistemaRoutingModule
  ]
})
export class SistemaModule { }
