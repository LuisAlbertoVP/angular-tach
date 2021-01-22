import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { RolService }  from '../rol.service';
import { Rol, Roles } from '@models/auth';
import { Busqueda, busquedaBase } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { RolDetailComponent } from './rol-detail/rol-detail.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.css'],
  animations: detailExpand
})
export class RolListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'FechaIngreso', 'FechaModificacion', 'accion'];
  busqueda: Busqueda = busquedaBase;
  criterio = new Subject();
  data: Rol[] = [];
  expandedElement: Rol = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private service: RolService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    sharedService.buildMenuBar({ title: 'Roles', filterEvent: () => this.openFilter() });
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

  get newBusqueda() {
    let busqueda: Busqueda = { filtros: [], estado: this.busqueda.estado, operadorLogico: this.busqueda.operadorLogico };
    const activo = this.sort.active ? this.sort.active : 'FechaModificacion';
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    for(let filtro of this.busqueda.filtros) {
      if(filtro.checked) {
        busqueda.filtros.push(filtro);
      }
    }
    return busqueda;
  }

  ngAfterViewInit(): void {
    const criterio$ = this.criterio.asObservable();
    criterio$.subscribe(() => this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(criterio$, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(this.newBusqueda);
      }), map(data => {
        const roles: Roles = (data as HttpResponse<Roles>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = roles.total;
        return roles.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  updateEstado(rol: Rol) {
    const cloneRol = Object.assign({}, rol);
    cloneRol.estado = cloneRol.estado ? false : true;
    this.service.setStatus(cloneRol).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          rol.estado = cloneRol.estado;
        } else {
          this.data = this.data.filter(oldRol => oldRol.id != rol.id);
        }
        this.showMessage(response.body.result);
      }
    });
  }

  delete(rol: Rol) {
    this.service.delete(rol).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldRol => oldRol.id != rol.id);
        this.showMessage(response.body.result);
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
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.navigateToPrincipal(result);
      }
    });
  }

  navigateToPrincipal(busqueda: Busqueda) {
    const extras: NavigationExtras = {
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true
    };
    this.router.navigate(['/principal/roles'], extras);
  }

  reload() {
    if(this.busqueda == busquedaBase) {
      this.initSearch();
    } else {
      this.navigateToPrincipal(busquedaBase);
    }
  }

  initSearch = () => this.criterio.next();

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');

  parseArray = (array: any[]) => array.map(element => element.descripcion).join(', ');

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}