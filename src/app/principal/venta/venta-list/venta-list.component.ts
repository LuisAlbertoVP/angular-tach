import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VentaService }  from '../venta.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { Venta, Table } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { detailExpand } from '@animations/detailExpand';
import * as moment from 'moment';

@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
  animations: detailExpand
})
export class VentaListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Fecha', 'Direccion', 'Cantidad', 'Total', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildTransaccion();
  criterio = new Subject();
  criterio$ = this.criterio.asObservable();
  data: Venta[] = [];
  expandedElement: Venta = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;
  resultsStock: number = 0;
  resultsPrecio: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: VentaService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Ventas', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.activedRoute.queryParamMap.subscribe(params => {
      const busqueda: Busqueda = JSON.parse(params.get('busqueda'));
      if(busqueda) {
        this.busqueda = busqueda;
        this.initSearch();
      }
    });
  }

  ngAfterViewInit(): void {
    const builder = new BusquedaBuilder(this.criterio$, this.paginator, this.sort);
    merge(this.criterio$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(builder.newBusqueda(this.busqueda, 'FechaIngreso'));
      }), map(data => {
        const ventas: Table<Venta> = (data as HttpResponse<Table<Venta>>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = ventas.cantidad;
        this.resultsStock = ventas.stock;
        this.resultsPrecio = ventas.precio;
        return ventas.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  changeEstado() {
    this.busqueda.estado = !this.busqueda.estado;
    this.initSearch();
  }

  edit(id: string) {
    this.router.navigate(['/principal/ventas/venta', id]);
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/ventas'], extras);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.navigateToPrincipal(result);
      }
    });
  }

  reload() {
    const busqueda: Busqueda = BusquedaBuilder.BuildTransaccion();
    busqueda.estado = this.busqueda.estado;
    this.navigateToPrincipal(busqueda);
  }

  updateEstado(venta: Venta) {
    const cloneVenta = Object.assign({}, venta);
    cloneVenta.estado = cloneVenta.estado ? false : true;
    this.service.setStatus(cloneVenta).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldVenta => oldVenta.id != venta.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
  parseDate = (fecha: string) => moment(fecha).format('DD/MM/YYYY');
  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
}