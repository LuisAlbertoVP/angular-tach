import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Repuesto } from '@models/tach';

@Component({
  selector: 'app-venta-detail',
  templateUrl: './venta-detail.component.html',
  styleUrls: ['./venta-detail.component.css']
})
export class VentaDetailComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['codigo', 'descripcion', 'cantidad', 'precio', 'total'];
  dataSource: MatTableDataSource<Repuesto>;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.data = [];
    this.dataSource.sort = this.sort;
  }
}