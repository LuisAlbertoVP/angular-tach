import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Dataset, MyChart } from '@models/form';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reporte-chart',
  template: `<div><canvas #chart></canvas></div>`
})
export class ReporteChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chart', {static: false}) context: ElementRef<HTMLCanvasElement>;
  @Input() myChart: MyChart;
  chart: Chart = null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.myChart.previousValue) {
      this.chart.destroy();
      this._buildChart();
    }
  }

  ngAfterViewInit(): void {
    this._buildChart();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
  }

  private _buildChart() {
    const dataset: Dataset = this.myChart.dataset;
    let colors = this._buildColors(dataset.labels.length);
    this.chart = new Chart(this.context.nativeElement.getContext('2d'), {
      type: dataset.type,
      data: {
        labels: dataset.labels.slice(dataset.labels.length - this.myChart.lastCount, dataset.labels.length),
        datasets: [{
          label: this.myChart.id,
          data: dataset.data.slice(dataset.data.length - this.myChart.lastCount, dataset.data.length),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      }, 
      options: this.myChart.options
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
}