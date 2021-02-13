import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReporteRoutingModule } from './reporte-routing.module';
import { ReporteDetailComponent } from './reporte-detail/reporte-detail.component';


@NgModule({
  declarations: [ReporteDetailComponent],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ReporteModule { }
