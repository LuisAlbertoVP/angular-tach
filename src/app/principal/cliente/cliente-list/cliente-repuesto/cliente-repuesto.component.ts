import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ClienteService } from '../../cliente.service';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Cliente, Venta } from '@models/entity';

@Component({
  selector: 'app-cliente-repuesto',
  templateUrl: './cliente-repuesto.component.html'
})
export class ClienteRepuestoComponent implements OnInit {
  isLoading: boolean = true;
  ventas$: Observable<Venta[]>;
  search: FormControl = new FormControl();
  ventas: Venta[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private service: ClienteService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getVentas(this.data.id).subscribe(ventas => {
      this.ventas = ventas;
      this.ventas$ = this.search.valueChanges.pipe(startWith(''),map(value => this._filter(value)));
      this.isLoading = false;
    });
  }

  private _filter(value: string): Venta[] {
    const filterValue: string = value.toLowerCase();
    return this.ventas.filter(venta => venta.direccion.toLowerCase().includes(filterValue) || 
      this.sharedService.parseDate(venta.fecha).indexOf(filterValue) === 0);
  }
}