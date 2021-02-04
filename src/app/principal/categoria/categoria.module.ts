import { NgModule } from '@angular/core';
import { GeneralSharedModule } from '@shared/general-shared/general-shared.module';
import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaListComponent } from './categoria-list/categoria-list.component';
import { CategoriaDetailComponent } from './categoria-list/categoria-detail/categoria-detail.component';


@NgModule({
  declarations: [CategoriaListComponent, CategoriaDetailComponent],
  imports: [
    GeneralSharedModule,
    CategoriaRoutingModule
  ]
})
export class CategoriaModule { }
