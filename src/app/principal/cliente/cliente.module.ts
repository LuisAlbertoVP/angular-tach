import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ClienteRoutingModule } from './cliente-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteDetailComponent } from './cliente-list/cliente-detail/cliente-detail.component';


@NgModule({
  declarations: [ClienteListComponent, ClienteDetailComponent],
  imports: [
    SharedModule,
    ClienteRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class ClienteModule { }
