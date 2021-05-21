import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RepuestoService } from '../../repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Repuesto } from '@models/entity';

@Component({
  selector: 'app-repuesto-reporte',
  templateUrl: './repuesto-reporte.component.html',
  styleUrls: ['./repuesto-reporte.component.css']
})
export class RepuestoReporteComponent implements OnInit {
  isLoading: boolean = true;
  repuesto: Repuesto = null;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Repuesto,
    private service: RepuestoService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getReporte(this.data.id).subscribe(repuesto => {
      repuesto.ventaDetalle.sort((a, b) => Date.parse(b.venta.fecha) - Date.parse(a.venta.fecha));
      repuesto.compraDetalle.sort((a, b) => Date.parse(b.compra.fecha) - Date.parse(a.compra.fecha));
      this.repuesto = repuesto;
      this.isLoading = false;
    });
  }
}