import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CategoriaListComponent } from './categoria-list/categoria-list.component';
import { CategoriaDetailComponent } from './categoria-list/categoria-detail/categoria-detail.component';


@NgModule({
  declarations: [CategoriaListComponent, CategoriaDetailComponent],
  imports: [
    SharedModule
  ]
})
export class CategoriaModule { }
