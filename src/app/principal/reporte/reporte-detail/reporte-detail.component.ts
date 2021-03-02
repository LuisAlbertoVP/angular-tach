import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../reporte.service';
import { Categoria, Marca, Transaccion } from '@models/entity';
import { Dataset, MyChart, Reporte } from '@models/form';
import { SharedService } from '@shared/shared.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  styleUrls: ['./reporte-detail.component.css']
})
export class ReporteDetailComponent implements OnInit {
  chartBusqueda: MyChart = null;
  myCharts: MyChart[] = [];
  isLoading: boolean = true;
  reporte: Reporte = null;

  constructor(
    private service: ReporteService,
    sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Reporte' });
  }

  get totalComprado() {
    return this.reporte?.compras.reduce((previus, compra) => compra.cantidad + previus, 0);
  }

  get totalVendido() {
    return this.reporte?.ventas.reduce((previus, venta) => venta.cantidad + previus, 0);
  }

  ngOnInit(): void {
    this.service.get().subscribe(reporte => { 
      this._addChart(this._datasetPie(reporte.categorias), 'Categorías', this._pieOptions('Categorías'));
      this._addChart(this._datasetPie(reporte.marcas), 'Marcas', this._pieOptions('Marcas'));
      this._addChart(this._datasetLine(reporte.ventas), 'Unidades vendidas', this._lineOptions());
      this._addChart(this._datasetBar2(reporte.categorias, 'horizontalBar'), 'Categorías más vendidas');
      this._addChart(this._datasetBar2(reporte.marcas), 'Marcas más vendidas');
      this._addChart(this._datasetLine(reporte.compras), 'Unidades compradas', this._lineOptions());
      this._addChart(this._datasetBar1(reporte.categorias), 'Categorías más compradas');
      this._addChart(this._datasetBar1(reporte.marcas, 'horizontalBar'), 'Marcas más compradas');
      this.reporte = reporte;
      this.isLoading = false;
    });
  }

  updateChartBusqueda(tipo: string, date1: string, date2: string, groupby: string) {
    let id = '';
    let transaccion = [];
    if(tipo == 'compras') {
      for(let compra of this.reporte.compras) {
        const fecha = Date.parse(compra.fecha);
        if(fecha >= Date.parse(date1) && fecha <= Date.parse(date2)) transaccion.push(compra);
      }
      id = 'Unidades compradas'
    } else {
      for(let venta of this.reporte.ventas) {
        const fecha = Date.parse(venta.fecha);
        if(fecha >= Date.parse(date1) && fecha <= Date.parse(date2)) transaccion.push(venta);
      }
      id = 'Unidades vendidas';
    }
    const dataset: Dataset = this._datasetLine(transaccion, groupby);
    this.chartBusqueda = { dataset: dataset, id: id, options: this._lineOptions(), lastCount: dataset.labels.length };
  }

  private _addChart(dataset: Dataset, id: string, options: any = {}, lastCount: number = 5) {
    this.myCharts.push({ dataset: dataset, id: id, options: options, lastCount: lastCount });
  }

  private _datasetBar1(data: Categoria[] | Marca[], type: string = 'bar'): Dataset {
    const sorted = data.slice(0).sort((a,b) => a.cantidadCompras - b.cantidadCompras);
    return { labels: sorted.map(d => d.descripcion), data: sorted.map(d => d.cantidadCompras.toString()), type: type };
  }

  private _datasetBar2(data: Categoria[] | Marca[], type: string = 'bar'): Dataset {
    const sorted = data.slice(0).sort((a,b) => a.cantidadVentas - b.cantidadVentas);
    return { labels: sorted.map(d => d.descripcion), data: sorted.map(d => d.cantidadVentas.toString()), type: type };
  }

  private _datasetLine(data: Transaccion[], format: string = 'w'): Dataset {
    const sorted = this._groupDatesBy(format, data.slice(0).sort((a,b) => Date.parse(a.fecha) - Date.parse(b.fecha)));
    return { labels: sorted.map(d => d.fecha), data: sorted.map(d => d.cantidad.toString()), type: 'line' };
  }

  private _datasetPie(data: Categoria[] | Marca[]): Dataset {
    const sorted = data.slice(0).sort((a,b) => a.stock - b.stock);
    return { labels: sorted.map(d => d.descripcion), data: sorted.map(d => d.stock.toString()), type: 'pie' };
  }

  private _lineOptions() {
    return { scales: { xAxes: [ {ticks: { autoSkip: false, callback: this._callbackDates } } ] } };
  }

  private _pieOptions(id: string) {
    return { title: { display: true, text: id }, legend: { display: true, position: 'right' } };
  }

  private _callbackDates(date: string) {
    const dates: string[] = date.split(' a ');
    const format = moment(dates[0]).locale('es').format('MMM w');
    return format.charAt(0).toUpperCase() + format.slice(1);
  }

  private _groupDatesBy(format: string, transacciones: Transaccion[]): Transaccion[] {
    const dates = this._getDatesMap(format, transacciones), dataParsed: Transaccion[] = [];
    for(let [_, data] of dates) {
      const fechaStart = data[0].fecha, fechaEnd = data[data.length - 1].fecha;
      const fecha = moment(fechaStart).format('YYYY-MM-DD') + ' a ' + moment(fechaEnd).format('YYYY-MM-DD');
      const cantidad = data.reduce((previus, transaccion) => previus + transaccion.cantidad, 0);
      dataParsed.push({ fecha: fecha, cantidad: cantidad });
    }
    return dataParsed;
  }

  private _getDatesMap(format: string, transacciones: Transaccion[]): Map<string, Transaccion[]> {
    return transacciones.reduce((previus, transaccion) => {
      const date: string = moment(transaccion.fecha).format(format);
      if(!previus.has(date)) {
        previus.set(date, []);
      }
      previus.get(date).push(transaccion);
      return previus;
    }, new Map<string, Transaccion[]>());
  }
}