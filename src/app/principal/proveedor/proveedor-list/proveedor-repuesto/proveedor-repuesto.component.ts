import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProveedorService } from '../../proveedor.service';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Cliente, Compra } from '@models/entity';

@Component({
  selector: 'app-proveedor-repuesto',
  templateUrl: './proveedor-repuesto.component.html'
})
export class ProveedorRepuestoComponent implements OnInit {
  isLoading: boolean = true;
  compras: Compra[] = [];
  compras$: Observable<Compra[]>;
  search: FormControl = new FormControl();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private service: ProveedorService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getCompras(this.data.id).subscribe(compras => {
      this.compras = compras;
      this.compras$ = this.search.valueChanges.pipe(startWith(''),map(value => this._filter(value)));
      this.isLoading = false;
    });
  }

  private _filter(value: string): Compra[] {
    const filterValue: string = value.toLowerCase();
    return this.compras.filter(compra => compra.numero.toLowerCase().includes(filterValue) || 
      this.sharedService.parseDate(compra.fecha).indexOf(filterValue) === 0);
  }
}