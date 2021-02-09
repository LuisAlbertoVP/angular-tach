import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RolRoutingModule } from './rol-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RolListComponent } from './rol-list/rol-list.component';
import { RolDetailComponent } from './rol-list/rol-detail/rol-detail.component';


@NgModule({
  declarations: [RolListComponent, RolDetailComponent],
  imports: [
    SharedModule,
    RolRoutingModule,
    MatCheckboxModule
  ]
})
export class RolModule { }
