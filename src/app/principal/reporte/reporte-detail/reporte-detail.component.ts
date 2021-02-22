import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ReporteService } from '../reporte.service';
import { Categoria, Marca, Transaccion } from '@models/entity';
import { Reporte } from '@models/form';
import { SharedService } from '@shared/shared.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  styleUrls: ['./reporte-detail.component.css']
})
export class ReporteDetailComponent implements OnDestroy, AfterViewInit {
  @ViewChild('categorias', {static: false}) categoriasCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('compras', {static: false}) comprasCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('marcas', {static: false}) marcasCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('ventas', {static: false}) ventasCanvas: ElementRef<HTMLCanvasElement>;
  chart: Chart = null;
  isLoading: boolean = true;
  isMobile: boolean = false;
  reporte: Reporte = null;

  constructor(
    private service: ReporteService,
    sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Reporte' });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnDestroy(): void {
    this.chart.destroy();
  }

  ngAfterViewInit(): void {
    this.service.get().subscribe(reporte => {
      this.isLoading = false;
      this.reporte = reporte;
      const compras = this._groupTransaccionDatesBy('w', reporte.compras);
      const ventas = this._groupTransaccionDatesBy('w', reporte.ventas); 
      this._buildPieChart(this.categoriasCanvas, 'Categorías', reporte.categorias.slice(0 , 5));
      this._buildPieChart(this.marcasCanvas, 'Marcas', reporte.marcas.slice(0, 5));
      this._buildLineChart(this.comprasCanvas, 'Compras', compras);
      this._buildLineChart(this.ventasCanvas, 'Ventas', ventas);
    });
  }

  private _buildColors(length: number) {
    let background = [], borders = [];
    for(let i = 0; i < length; i++) {
      let o = Math.round, random = Math.random, s = 255;
      let r = o(random()*s), g = o(random()*s), b = o(random()*s);
      background.push('rgba(' +r + ',' + g + ',' + b + ',' + 0.2 + ')');
      borders.push('rgba(' +r + ',' + g + ',' + b + ',' + 1 + ')');
    }
    return { background: background, borders: borders };
  }

  private _buildPieChart(ctx: ElementRef<HTMLCanvasElement>, id: string, entity: Categoria[] | Marca[]) {
    let colors = this._buildColors(entity.length);
    this.chart = new Chart(ctx.nativeElement.getContext('2d'), {
      type: 'pie',
      data: {
        labels: entity.map(base => base.descripcion),
        datasets: [{
          label: id,
          data: entity.map(base => base.stock),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      },
      options: {
        title: { display: true, text: id },
        legend: { display: true, position: 'right' }
      }
    });
  }

  private _buildLineChart(ctx: ElementRef<HTMLCanvasElement>, id: string, transaccion: Transaccion[]) {
    let colors = this._buildColors(transaccion.length);
    this.chart = new Chart(ctx.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: transaccion.map(base => base.fecha),
        datasets: [{
          label: id,
          data: transaccion.map(base => base.cantidad),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: { autoSkip: false, callback: this._callbackDates }
         }]
        }
      }
    });
  }

  private _callbackDates(date: string) {
    const dates: string[] = date.split(' a ');
    const format = moment(dates[0]).locale('es').format('MMM w');
    return format.charAt(0).toUpperCase() + format.slice(1);
  }

  private _groupTransaccionDatesBy(format: string, transacciones: Transaccion[]): Transaccion[] {
    const dates = this._groupDatesBy(format, transacciones), dataParsed: Transaccion[] = [];
    for(let [_, data] of dates) {
      const fechaStart = data[0].fecha, fechaEnd = data[data.length - 1].fecha;
      const fecha = moment(fechaStart).format('YYYY-MM-DD') + ' a ' + moment(fechaEnd).format('YYYY-MM-DD');
      const cantidad = data.reduce((previus, venta) => previus + venta.cantidad, 0);
      dataParsed.push({ fecha: fecha, cantidad: cantidad });
    }
    return dataParsed;
  }

  private _groupDatesBy(format: string, transacciones: Transaccion[]): Map<string, Transaccion[]> {
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