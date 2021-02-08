import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Busqueda } from '@models/busqueda';
import { Repuesto, Table } from '@models/entity';
import { PrintingService } from '@shared/printing.service';
import { RepuestoService }  from '../../repuesto.service';

@Component({
  selector: 'app-repuesto-print',
  templateUrl: './repuesto-print.component.html',
  styleUrls: ['./repuesto-print.component.css']
})
export class RepuestoPrintComponent implements OnInit {
  busqueda: Busqueda = null;
  repuestos: Repuesto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private printing: PrintingService,
    private service: RepuestoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const busqueda: Busqueda = JSON.parse(params.get('printObject'));
      this.service.getAll(busqueda).subscribe(repuestos => {
        busqueda.filtros = busqueda.filtros.filter(filtro => filtro.id != 'Id');
        this.busqueda = busqueda;
        this.repuestos = (repuestos as HttpResponse<Table<Repuesto>>).body.data;
        this.printing.dataOnLoad();
      });
    });
  }

  parseArray = (array: string[]) => array.map(element => element).join(', ');
}