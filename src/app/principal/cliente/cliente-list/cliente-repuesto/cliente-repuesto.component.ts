import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ClienteService } from '../../cliente.service';
import { SharedService } from '@shared/shared.service';
import { Cliente, Venta } from '@models/entity';

@Component({
  selector: 'app-cliente-repuesto',
  templateUrl: './cliente-repuesto.component.html'
})
export class ClienteRepuestoComponent implements OnInit {
  isLoading: boolean = true;
  ventas: Venta[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private service: ClienteService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getVentas(this.data.id).subscribe(ventas => {
      this.ventas = ventas;
      this.isLoading = false;
    });
  }
}