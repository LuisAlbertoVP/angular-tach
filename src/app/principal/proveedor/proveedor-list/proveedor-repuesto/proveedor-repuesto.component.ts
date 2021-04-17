import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProveedorService } from '../../proveedor.service';
import { SharedService } from '@shared/shared.service';
import { Cliente, Compra } from '@models/entity';

@Component({
  selector: 'app-proveedor-repuesto',
  templateUrl: './proveedor-repuesto.component.html'
})
export class ProveedorRepuestoComponent implements OnInit {
  isLoading: boolean = true;
  compras: Compra[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    private service: ProveedorService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getCompras(this.data.id).subscribe(compras => {
      this.compras = compras;
      this.isLoading = false;
    });
  }
}