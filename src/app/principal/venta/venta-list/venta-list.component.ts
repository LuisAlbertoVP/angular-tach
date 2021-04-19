import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VentaService }  from '../venta.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaFactory, BusquedaBuilder, busquedaVenta } from '@models/busqueda';
import { Venta } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
  animations: detailExpand
})
export class VentaListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Fecha', 'Direccion', 'VentaDetalle.Sum(Cantidad)', 
    'VentaDetalle.Sum(Cantidad * Precio)', 'accion'];
  busqueda: BusquedaBuilder = { rootBusqueda: busquedaVenta };
  customEvent = new Subject();
  customEvent$ = this.customEvent.asObservable();
  data: Venta[] = [];
  expandedElement: Venta = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  isTrash: boolean = true;
  resultsLength: number = 0;
  resultsStock: number = 0;
  resultsTotal: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: VentaService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Ventas', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.activedRoute.queryParamMap.subscribe(params => {
      const busqueda: Busqueda = JSON.parse(params.get('busqueda'));
      if(busqueda) {
        this.busqueda.nextBusqueda = busqueda;
        this.initSearch();
      }
    });
  }

  ngAfterViewInit(): void {
    const builder = new BusquedaFactory(this.customEvent$, this.paginator, this.sort);
    merge(this.customEvent$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        this.busqueda.nextBusqueda = builder.newBusqueda(this.busqueda.nextBusqueda);
        return this.service.getAll(this.busqueda.nextBusqueda);
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        this.resultsStock = response.body.stock;
        this.resultsTotal = response.body.total;
        return response.body.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  changeEstado() {
    this.busqueda.nextBusqueda.estado = !this.busqueda.nextBusqueda.estado;
    this.initSearch();
  }

  edit(id: string) {
    this.router.navigate(['/principal/ventas/venta', id]);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe((result: Busqueda) => {
      if(result) {
        const extras: NavigationExtras = { 
          queryParams: { busqueda: JSON.stringify(result) }, skipLocationChange: true 
        };
        this.router.navigate(['/principal/ventas'], extras);
      }
    });
  }

  reload() {
    this.busqueda.nextBusqueda = null;
    this.initSearch();
  }

  updateEstado(venta: Venta) {
    const clone: Venta = Object.assign({}, venta);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != venta.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.customEvent.next();
}