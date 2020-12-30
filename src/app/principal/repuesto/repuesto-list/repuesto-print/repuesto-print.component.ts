import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Busqueda } from '@models/busqueda';
import { Repuesto, Repuestos } from '@models/tach';
import { PrintingService } from '@print_service/*';
import { RepuestoService }  from '../../repuesto.service';

@Component({
  selector: 'app-repuesto-print',
  templateUrl: './repuesto-print.component.html',
  styleUrls: ['./repuesto-print.component.css']
})
export class RepuestoPrintComponent implements OnInit {
  busqueda: Busqueda;
  repuestos: Repuesto[] = [];
  regex = /%/g;

  constructor(
    private activatedRoute: ActivatedRoute,
    private printing: PrintingService,
    private service: RepuestoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(param => {
      this.busqueda = JSON.parse(param.get('busqueda'));
      this.service.getAll(this.busqueda).subscribe(repuestos => {
        this.repuestos = (repuestos as HttpResponse<Repuestos>).body.repuestos;
        this.printing.dataOnLoad('/principal/repuestos');
      });
    });
  }
}