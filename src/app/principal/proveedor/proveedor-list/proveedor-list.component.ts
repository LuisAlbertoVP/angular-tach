import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProveedorService }  from '../proveedor.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { Proveedor } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { ProveedorDetailComponent } from './proveedor-detail/proveedor-detail.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
  animations: detailExpand
})
export class ProveedorListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'Telefono', 'WebSite', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildProveedor();
  criterio = new Subject();
  criterio$ = this.criterio.asObservable();
  data: Proveedor[] = [];
  expandedElement: Proveedor = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: ProveedorService,
    public sharedService: SharedService
  ) { 
    sharedService.buildMenuBar({ title: 'Proveedores', filterEvent: () => this.openFilter() });
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
        return this.service.getAll(builder.newBusqueda(this.busqueda));
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        return response.body.data;
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

  delete(proveedor: Proveedor) {
    this.service.delete(proveedor).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != proveedor.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  goToWebsite(url: string) {
    if(!url.startsWith('http://')) {
      url = 'http://' + url;
    }
    window.open(url, '_blank');
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/proveedores'], extras);
  }

  openConfirmation(proveedor: Proveedor) {
    const data = { mensaje: "¿Está seguro de que desea eliminar definitivamente este proveedor?", accion: "Eliminar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(proveedor) : this.sharedService.showWarningMessage('No se han aplicado los cambios');
    });
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.navigateToPrincipal(result);
    });
  }

  openForm(proveedor?: Proveedor) {
    const dialogRef = this.dialog.open(ProveedorDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: proveedor
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  reload() {
    const busqueda: Busqueda = BusquedaBuilder.BuildProveedor();
    busqueda.estado = this.busqueda.estado;
    this.navigateToPrincipal(busqueda);
  }

  updateEstado(proveedor: Proveedor) {
    const clone: Proveedor = Object.assign({}, proveedor);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != proveedor.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
}