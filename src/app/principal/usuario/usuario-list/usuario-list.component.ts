import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { UsuarioService }  from '../usuario.service';
import { User, Users } from '@models/auth';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';
import { ConfirmacionComponent } from '../../shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  animations: detailExpand
})
export class UsuarioListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  readonly mobileColumns: string[] = ['opciones', 'Nombres', 'NombreUsuario', 'accion'];
  readonly normalColumns: string[] = ['opciones', 'Nombres', 'NombreUsuario', 'Telefono', 'Celular', 'Cedula', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildUsuario();
  criterio = new Subject();
  data: User[] = [];
  expandedElement: User = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: UsuarioService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Usuarios', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  get columns() {
    return this.isMobile ? this.mobileColumns : this.normalColumns;
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
        if(filtro.operador == 'between') {
          busqueda.filtros.push(filtro);
        } else {
          if(filtro.criterios.length > 0) {
            busqueda.filtros.push(filtro);
          }
        }
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
        const usuarios: Users = (data as HttpResponse<Users>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = usuarios.total;
        return usuarios.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  delete(user: User) {
    this.service.delete(user).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldUser => oldUser.id != user.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/usuarios'], extras);
  }

  openConfirmation(user: User) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, 
      data: '¿Está seguro de que desea eliminar definitivamente este usuario?'
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(user) : this.sharedService.showMessage('No se han aplicado los cambios');
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

  openForm(user?: User) {
    const dialogRef = this.dialog.open(UsuarioDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: user
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  reload() {
    const busqueda: Busqueda = BusquedaBuilder.BuildUsuario();
    busqueda.estado = this.busqueda.estado;
    this.navigateToPrincipal(busqueda);
  }

  updateEstado(user: User) {
    const cloneUser = Object.assign({}, user);
    cloneUser.estado = cloneUser.estado ? false : true;
    this.service.setStatus(cloneUser).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldUser => oldUser.id != user.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
  parseDate = (fecha: string) => moment(fecha).format('DD/MM/YYYY');
  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
  parseArray = (array: any[]) => array.map(element => element.descripcion).join(', ');
}