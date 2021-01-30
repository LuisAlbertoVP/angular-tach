import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { ProveedorService }  from '../proveedor.service';
import { Proveedor, Proveedores } from '@models/tach';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorDetailComponent } from './proveedor-detail/proveedor-detail.component';
import { ConfirmacionComponent } from '../../shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
  animations: detailExpand
})
export class ProveedorListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'Convenio', 'Telefono', 'Direccion', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildProveedor();
  criterio = new Subject();
  data: Proveedor[] = [];
  expandedElement: Proveedor = null;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: ProveedorService,
    private sharedService: SharedService
  ) { 
    sharedService.buildMenuBar({ title: 'Proveedores', filterEvent: () => this.openFilter() });
  }

  get newBusqueda() {
    let busqueda: Busqueda = { 
      filtros: [], estado: this.busqueda.estado, operadorLogico: this.busqueda.operadorLogico 
    };
    const activo = this.sort.active ? this.sort.active : 'FechaModificacion';
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    busqueda.filtros.push({ id: "Id", criterios: [''], operador: 'contiene' });
    for(let filtro of this.busqueda.filtros) {
      if(filtro.checked) {
        busqueda.filtros.push(filtro);
      }
    }
    return busqueda;
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
    const criterio$ = this.criterio.asObservable();
    criterio$.subscribe(() => this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(criterio$, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(this.newBusqueda);
      }), map(data => {
        const proveedores: Proveedores = (data as HttpResponse<Proveedores>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = proveedores.total;
        return proveedores.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  delete(proveedor: Proveedor) {
    this.service.delete(proveedor).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldProveedor => oldProveedor.id != proveedor.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/proveedores'], extras);
  }

  openConfirmation(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, 
      data: '¿Está seguro de que desea eliminar este proveedor?'
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(proveedor) : this.sharedService.showMessage('No se han aplicado los cambios');
    });
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
    const cloneProveedor = Object.assign({}, proveedor);
    cloneProveedor.estado = cloneProveedor.estado ? false : true;
    this.service.setStatus(cloneProveedor).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          proveedor.estado = cloneProveedor.estado;
        } else {
          this.data = this.data.filter(oldProveedor => oldProveedor.id != proveedor.id);
        }
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
}