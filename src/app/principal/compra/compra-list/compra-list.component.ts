import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompraService }  from '../compra.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaFactory, BusquedaBuilder, busquedaCompra } from '@models/busqueda';
import { Compra } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-compra-list',
  templateUrl: './compra-list.component.html',
  styleUrls: ['./compra-list.component.css'],
  animations: detailExpand
})
export class CompraListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Fecha', 'TipoDocumento', 'Numero',
    'CompraDetalle.Sum(Cantidad)', 'CompraDetalle.Sum(Cantidad * Precio)', 'accion'];
  busqueda: BusquedaBuilder = { rootBusqueda: busquedaCompra };
  customEvent = new Subject();
  customEvent$ = this.customEvent.asObservable();
  data: Compra[] = [];
  expandedElement: Compra = null;
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
    private service: CompraService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Compras', filterEvent: () => this.openFilter() });
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

  downloadFile(id: string) {
    this.service.downloadFile(id).subscribe(response => {
      if(response?.size) {
        let url = window.URL.createObjectURL(response);
        window.open(url);
      } else {
        this.sharedService.showErrorMessage('El archivo no existe');
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/principal/compras/compra', id]);
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
        this.router.navigate(['/principal/compras'], extras);
      }
    });
  }

  reload() {
    this.busqueda.nextBusqueda = null;
    this.initSearch();
  }

  updateEstado(compra: Compra) {
    const clone: Compra = Object.assign({}, compra);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != compra.id);
        this.sharedService.showMessage(response.body.texto);
      }
    });
  }

  initSearch = () => this.customEvent.next();
}