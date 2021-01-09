import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { RolService }  from '../rol.service';
import { Rol, Roles } from '@models/auth';
import { Busqueda, busquedaBase } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { RolDetailComponent } from './rol-detail/rol-detail.component';
import * as moment from 'moment';
import { FiltroComponent } from '../../shared/filtro/filtro.component';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.css'],
  animations: detailExpand
})
export class RolListComponent implements OnInit, AfterViewInit {
  @ViewChild('btnSearch', { read: ElementRef }) button: ElementRef;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'descripcion', 'ingreso', 'modificacion', 'accion'];
  busqueda: Busqueda = busquedaBase;
  data: Rol[] = [];
  expandedElement: Rol = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private service: RolService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    sharedService.buildMenuBar({ title: 'Roles', addEvent: () => this.openFilter() });
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    const btnEvent = fromEvent(this.button.nativeElement, 'click');
    btnEvent.subscribe(e =>  this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(btnEvent, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(this.newBusqueda);
      }), map(data => {
        const roles: Roles = (data as HttpResponse<Roles>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = roles.total;
        return roles.roles;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  reload() {
    this.busqueda = busquedaBase;
    this.initSearch();
  }

  initSearch = () => this.button.nativeElement.click();

  updateEstado(rol: Rol) {
    const cloneRol = Object.assign({}, rol);
    cloneRol.estado = cloneRol.estado ? false : true;
    this.service.setStatus(cloneRol).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          rol.estado = cloneRol.estado;
        } else {
          this.data = this.data.filter(oldRol => oldRol.id != rol.id);
        }
        this.showMessage(response.body);
      }
    });
  }

  openDialog(rol?: Rol) {
    const dialogRef = this.dialog.open(RolDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: rol
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

  delete(rol: Rol) {
    this.service.delete(rol).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldRol => oldRol.id != rol.id);
        this.showMessage(response.body);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}