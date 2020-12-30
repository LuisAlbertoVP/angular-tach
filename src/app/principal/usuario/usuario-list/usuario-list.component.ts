import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '@shared_service/shared';
import { UsuarioService }  from '../usuario.service';
import { Option, optionsUsuarios } from '@models/options';
import { User, Users } from '@models/auth';
import { Busqueda } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDetailComponent } from './usuario-detail/usuario-detail.component';
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
  displayedColumns: string[] = ['opciones', 'nombres', 'nombreUsuario', 'telefono', 'celular', 'correo', 'accion'];
  options: Option[] = optionsUsuarios;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  data: User[] = [];
  expandedElement: User = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  form = this.fb.group({
    filtros: this.fb.array([]),
    estado: ['2']
  });

  constructor(
    sharedService: SharedService,
    private service: UsuarioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    sharedService.buildMenuBar({ title: 'Usuarios', addEvent: () => this.openDialog() });
  }

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  ngOnInit(): void {
    this.addFiltro();
  }

  ngAfterViewInit(): void {
    const btnEvent = fromEvent(this.button.nativeElement, 'click');
    btnEvent.subscribe(e =>  this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(btnEvent, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        const busqueda: Busqueda = this.form.getRawValue();
        const activo = this.sort.active ? this.sort.active : 'fec_mod';
        const direccion = this.sort.direction ? this.sort.direction : 'desc';
        busqueda.orden = { activo: activo, direccion: direccion };
        busqueda.pagina = this.paginator.pageIndex;
        busqueda.cantidad = this.paginator.pageSize;
        for(let filtro of busqueda.filtros) {
          if(filtro.columna == 'fecha_nacimiento' || filtro.columna == 'fecha_contratacion' || 
              filtro.columna == 'fec_ing' || filtro.columna == 'fec_mod') {
            filtro.criterio1 = moment(filtro.criterio1).format('YYYY-MM-DD');
            filtro.criterio2 = filtro.condicion == 'between' ? moment(filtro.criterio2).format('YYYY-MM-DD') : '';
          }
          filtro.criterio1 = filtro.condicion == 'like' ? `%${filtro.criterio1}%` : filtro.criterio1;
        }
        return this.service.getAll(busqueda);
      }), map(data => {
        const usuarios: Users = (data as HttpResponse<Users>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = usuarios.total;
        return usuarios.usuarios;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;

  addCriterio(filtro: FormControl, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.criterios(filtro).push(this.fb.control(value));
    }
    if (input) {
      input.value = '';
    }
  }

  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  initSearch = () => this.button.nativeElement.click();

  reload() {
    this.filtros.clear();
    this.addFiltro();
    this.initSearch();
  }

  addFiltro() {
    this.filtros.push(this.fb.group({
        columna: ['nombres'], criterios: this.fb.array([]), criterio1: [''], criterio2: [''], condicion: ['like']
      })
    );
  }

  deleteFiltro = (index: number) => this.filtros.length > 1 ? this.filtros.removeAt(index) : null;

  esFecha(filtro: FormControl) {
    const column: string = filtro.get('columna').value;
    return column == 'fecha_nacimiento' || column == 'fecha_contratacion' || column == 'fec_ing' || column == 'fec_mod';
  }

  clearCriterio1 = (filtro: FormControl) => filtro.get('criterio1').setValue('');

  clearCriterio2 = (filtro: FormControl) => filtro.get('criterio2').setValue('');

  clearCriterios(filtro: FormControl) {
    this.clearCriterio1(filtro);
    this.clearCriterio2(filtro);
    this.criterios(filtro).clear();
  }

  updateEstado(user: User) {
    const cloneUser = Object.assign({}, user);
    cloneUser.estado = cloneUser.estado == 1 ? 0 : 1;
    this.service.setStatus(cloneUser).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.form.getRawValue().estado == 2) {
          user.estado = cloneUser.estado;
        } else {
          this.data = this.data.filter(oldUser => oldUser.id != user.id);
        }
        this.showMessage(response.body);
      }
    });
  }

  openDialog(usuario?: User) {
    const dialogRef = this.dialog.open(UsuarioDetailComponent, {
      width: '720px', data: usuario
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  delete(id: string) {
    this.service.delete(id).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldUser => oldUser.id != id);
        this.showMessage(response.body);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}