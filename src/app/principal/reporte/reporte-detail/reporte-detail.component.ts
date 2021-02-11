import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ReporteService } from '../reporte.service';
import { Chart } from 'chart.js';
import { Categoria, Marca } from '@models/entity';
import { Reporte } from '@models/form';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-reporte-detail',
  templateUrl: './reporte-detail.component.html',
  styleUrls: ['./reporte-detail.component.css']
})
export class ReporteDetailComponent implements OnDestroy, AfterViewInit {
  @ViewChild('categorias', {static: false}) categoriasCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('marcas', {static: false}) marcasCanvas: ElementRef<HTMLCanvasElement>;
  chart: Chart = null;
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

  ngAfterViewInit() {
    this.service.get().subscribe(reporte => {
      this.reporte = reporte;
      this._buildChart(this.categoriasCanvas, 'Categorías', reporte.categorias);
      this._buildChart(this.marcasCanvas, 'Marcas', reporte.marcas);
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

  private _buildChart(ctx: ElementRef<HTMLCanvasElement>, id: string, entity: Categoria[] | Marca[]) {
    let colors = this._buildColors(entity.length);
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