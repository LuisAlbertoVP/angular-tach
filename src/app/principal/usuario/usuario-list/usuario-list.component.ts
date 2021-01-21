import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { UsuarioService }  from '../usuario.service';
import { User, Users } from '@models/auth';
import { Busqueda, busquedaUsuarios } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  animations: detailExpand
})
export class UsuarioListComponent implements OnInit, AfterViewInit {
  @ViewChild('btnSearch', { read: ElementRef }) button: ElementRef;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'Nombres', 'NombreUsuario', 'Telefono', 'Celular', 'Correo', 'accion'];
  busqueda: Busqueda = busquedaUsuarios;
  data: User[] = [];
  expandedElement: User = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private service: UsuarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    sharedService.buildMenuBar({ title: 'Usuarios', addEvent: () => this.openFilter() });
  }

  get newBusqueda() {
    let busqueda: Busqueda = { filtros: [], estado: this.busqueda.estado };
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

  reload() {
    this.busqueda = busquedaUsuarios;
    this.initSearch();
  }

  initSearch = () => this.button.nativeElement.click();

  parseDate = (fecha: string) => moment(fecha).format('DD/MM/YYYY');

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');

  parseArray = (array: any[]) => array.map(element => element.descripcion).join(', ');

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

  openDialog(usuario?: User) {
    const dialogRef = this.dialog.open(UsuarioDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: usuario
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.busqueda = result;
        this.initSearch();
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

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}