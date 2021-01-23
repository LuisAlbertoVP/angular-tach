import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { UsuarioService }  from '../usuario.service';
import { User, Users } from '@models/auth';
import { Busqueda, busquedaUsuarios } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'Nombres', 'NombreUsuario', 'Telefono', 'Celular', 'Correo', 'accion'];
  busqueda: Busqueda = busquedaUsuarios;
  criterio = new Subject();
  data: User[] = [];
  expandedElement: User = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private service: UsuarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    sharedService.buildMenuBar({ title: 'Usuarios', filterEvent: () => this.openFilter() });
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
    merge(criterio$, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
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
      })).subscribe(data => this.data = data);
  }

  updateEstado(user: User) {
    const cloneUser = Object.assign({}, user);
    cloneUser.estado = cloneUser.estado ? false : true;
    this.service.setStatus(cloneUser).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          user.estado = cloneUser.estado;
        } else {
          this.data = this.data.filter(oldUser => oldUser.id != user.id);
        }
        this.showMessage(response.body.result);
      }
    });
  }

  delete(user: User) {
    this.service.delete(user).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldUser => oldUser.id != user.id);
        this.showMessage(response.body.result);
      }
    });
  }

  openForm(user?: User) {
    const dialogRef = this.dialog.open(UsuarioDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: user
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openConfirmation(user: User) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: '¿Está seguro de eliminar el usuario?'
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(user) : this.showMessage('No se han aplicado los cambios');
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

  navigateToPrincipal(busqueda: Busqueda) {
    const extras: NavigationExtras = {
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true
    };
    this.router.navigate(['/principal/usuarios'], extras);
  }

  reload() {
    if(this.busqueda == busquedaUsuarios) {
      this.initSearch();
    } else {
      this.navigateToPrincipal(busquedaUsuarios);
    }
  }

  initSearch = () => this.criterio.next();

  parseDate = (fecha: string) => moment(fecha).format('DD/MM/YYYY');

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');

  parseArray = (array: any[]) => array.map(element => element.descripcion).join(', ');

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}