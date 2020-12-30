import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarcaListComponent } from './marca-list/marca-list.component';
import { MarcaDetailComponent } from './marca-list/marca-detail/marca-detail.component';


@NgModule({
  declarations: [MarcaListComponent, MarcaDetailComponent],
  imports: [
    SharedModule
  ]
})
export class MarcaModule { }
