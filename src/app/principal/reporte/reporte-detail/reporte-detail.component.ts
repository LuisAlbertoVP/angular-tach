import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ReporteService } from '../reporte.service';
import { Chart } from 'chart.js';
import { Categoria, Marca } from '@models/entity';
import { Reporte } from '@models/form';

@Component({
  selector: 'app-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  styleUrls: ['./reporte-detail.component.css']
})
export class ReporteDetailComponent implements OnDestroy, AfterViewInit {
  @ViewChild('categorias', {static: false}) categoriasCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('marcas', {static: false}) marcasCanvas: ElementRef<HTMLCanvasElement>;
  reporte: Reporte = null;
  chart: Chart = null;

  constructor(
    private service: ReporteService
  ) { }

  ngOnDestroy(): void {
    this.chart.destroy();
  }

  ngAfterViewInit() {
    this.service.get().subscribe(reporte => {
      this.reporte = reporte;
      this.buildPieChart(this.categoriasCanvas, 'Categorías', reporte.categorias);
      this.buildPieChart(this.marcasCanvas, 'Marcas', reporte.marcas);
    });
  }

  private buildColors(length: number) {
    let background = [], borders = [];
    for(let i = 0; i < length; i++) {
      let o = Math.round, random = Math.random, s = 255;
      let r = o(random()*s), g = o(random()*s), b = o(random()*s);
      background.push('rgba(' +r + ',' + g + ',' + b + ',' + 0.2 + ')');
      borders.push('rgba(' +r + ',' + g + ',' + b + ',' + 1 + ')');
    }
    return { background: background, borders: borders };
  }

  private buildPieChart(ctx: ElementRef<HTMLCanvasElement>, id: string, entity: Categoria[] | Marca[]) {

    let colors = this.buildColors(entity.length);
    this.chart = new Chart(ctx.nativeElement.getContext('2d'), {
      type: 'horizontalBar',
      data: {
        labels: entity.map(base => base.descripcion),
        datasets: [{
          label: id,
          data: entity.map(base => base.stock),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      }
    });
  }
}