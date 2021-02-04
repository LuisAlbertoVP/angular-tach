import { NgModule } from '@angular/core';
import { GeneralSharedModule } from '@shared/general-shared/general-shared.module';
import { MarcaRoutingModule } from './marca-routing.module';
import { MarcaListComponent } from './marca-list/marca-list.component';
import { MarcaDetailComponent } from './marca-list/marca-detail/marca-detail.component';


@NgModule({
  declarations: [MarcaListComponent, MarcaDetailComponent],
  imports: [
    GeneralSharedModule,
    MarcaRoutingModule
  ]
})
export class MarcaModule { }
