import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentaRoutingModule } from './cuenta-routing.module';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';


@NgModule({
  declarations: [CuentaDetailComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    CuentaRoutingModule
  ]
})
export class CuentaModule { }
