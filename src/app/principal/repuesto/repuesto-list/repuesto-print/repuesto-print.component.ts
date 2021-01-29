import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Busqueda } from '@models/busqueda';
import { Repuesto, Repuestos } from '@models/tach';
import { PrintingService } from '@print_service/*';
import { RepuestoService }  from '../../repuesto.service';
import * as moment from 'moment';

@Component({
  selector: 'app-repuesto-print',
  templateUrl: './repuesto-print.component.html',
  styleUrls: ['./repuesto-print.component.css']
})
export class RepuestoPrintComponent implements OnInit {
  busqueda: Busqueda;
  repuestos: Repuesto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private printing: PrintingService,
    private service: RepuestoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.busqueda = JSON.parse(params.get('printObject'));
      this.service.getAll(this.busqueda).subscribe(repuestos => {
        this.repuestos = (repuestos as HttpResponse<Repuestos>).body.data;
        this.printing.dataOnLoad('/principal/repuestos');
      });
    });
  }

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
}