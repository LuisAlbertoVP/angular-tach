import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RepuestoService } from '../../repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Repuesto } from '@models/entity';

@Component({
  selector: 'app-repuesto-reporte',
  templateUrl: './repuesto-reporte.component.html',
  styles: ['.ml { margin-left: 3% } ']
})
export class RepuestoReporteComponent implements OnInit {
  repuesto: Repuesto = null;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: string,
    private service: RepuestoService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.service.getReporte(this.id).subscribe(repuesto => this.repuesto = repuesto);
  }
}