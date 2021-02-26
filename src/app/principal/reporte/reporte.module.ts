import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReporteRoutingModule } from './reporte-routing.module';
import { ReporteDetailComponent } from './reporte-detail/reporte-detail.component';
import { ReporteChartComponent } from './reporte-detail/reporte-chart/reporte-chart.component';


@NgModule({
  declarations: [ReporteDetailComponent, ReporteChartComponent],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class ReporteModule { }
