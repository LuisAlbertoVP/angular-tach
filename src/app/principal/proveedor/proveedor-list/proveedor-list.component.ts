import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { ProveedorService }  from '../proveedor.service';
import { Proveedor, Proveedores } from '@models/tach';
import { Busqueda, busquedaProveedores } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorDetailComponent } from './proveedor-detail/proveedor-detail.component';
import * as moment from 'moment';
import { FiltroComponent } from '../../shared/filtro/filtro.component';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
  animations: detailExpand
})
export class ProveedorListComponent implements OnInit, AfterViewInit {
  @ViewChild('btnSearch', { read: ElementRef }) button: ElementRef;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'descripcion', 'convenio', 'telefono', 'direccion', 'accion'];
  busqueda: Busqueda = busquedaProveedores;
  data: Proveedor[] = [];
  expandedElement: Proveedor = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private service: ProveedorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { 
    sharedService.buildMenuBar({ title: 'Proveedores', addEvent: () => this.openFilter() });
  }

  get newBusqueda() {
    let busqueda: Busqueda = { filtros: [], estado: this.busqueda.estado };
    const activo = this.sort.active ? this.sort.active : 'fec_mod';
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    for(let filtro of this.busqueda.filtros) {
      if(filtro.checked) {
        if(filtro.esFecha) {
          filtro.criterio1 = moment(filtro.criterio1).format('YYYY-MM-DD');
          filtro.criterio2 = filtro.condicion == 'between' ? moment(filtro.criterio2).format('YYYY-MM-DD') : '';
        }
        filtro.criterio1 = filtro.condicion == 'like' ? `%${filtro.criterio1}%` : filtro.criterio1;
        busqueda.filtros.push(filtro);
      }
    }
    return busqueda;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const btnEvent = fromEvent(this.button.nativeElement, 'click');
    btnEvent.subscribe(e =>  this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(btnEvent, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(this.newBusqueda);
      }), map(data => {
        const proveedores: Proveedores = (data as HttpResponse<Proveedores>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = proveedores.total;
        return proveedores.proveedores;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  reload() {
    this.busqueda = busquedaProveedores;
    this.initSearch();
  }

  initSearch = () => this.button.nativeElement.click();

  updateEstado(proveedor: Proveedor) {
    const cloneProveedor = Object.assign({}, proveedor);
    cloneProveedor.estado = cloneProveedor.estado ? false : true;
    this.service.setStatus(cloneProveedor).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          proveedor.estado = cloneProveedor.estado;
        } else {
          this.data = this.data.filter(oldProveedor => oldProveedor.id != proveedor.id);
        }
        this.showMessage(response.body);
      }
    });
  }

  openDialog(proveedor?: Proveedor) {
    const dialogRef = this.dialog.open(ProveedorDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: proveedor
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda
    });
    dialogRef.afterClosed().subscribe(result => {
      this.busqueda = result ? result : this.busqueda;
      this.initSearch();
    });
  }

  delete(proveedor: Proveedor) {
    this.service.delete(proveedor).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldProveedor => oldProveedor.id != proveedor.id);
        this.showMessage(response.body);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}