import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Repuesto } from '@models/tach';

@Component({
  selector: 'app-venta-detail',
  templateUrl: './venta-detail.component.html',
  styleUrls: ['./venta-detail.component.css']
})
export class VentaDetailComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['codigo', 'descripcion', 'cantidad', 'precio', 'total'];
  dataSource: MatTableDataSource<Repuesto>;

  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}