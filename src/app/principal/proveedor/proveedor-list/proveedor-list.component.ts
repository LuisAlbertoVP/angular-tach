import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '@shared_service/shared';
import { ProveedorService }  from '../proveedor.service';
import { Option, optionsProveedores } from '@models/options';
import { Proveedor, Proveedores } from '@models/tach';
import { Busqueda } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorDetailComponent } from './proveedor-detail/proveedor-detail.component';
import * as moment from 'moment';

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
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options: Option[] = optionsProveedores;
  data: Proveedor[] = [];
  expandedElement: Proveedor = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  form = this.fb.group({
    filtros: this.fb.array([]),
    estado: ['2']
  });

  constructor(
    sharedService: SharedService,
    private service: ProveedorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { 
    sharedService.buildMenuBar({ title: 'Proveedores', addEvent: () => this.openDialog() });
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
          if(filtro.columna == 'fec_ing' || filtro.columna == 'fec_mod') {
            filtro.criterio1 = moment(filtro.criterio1).format('YYYY-MM-DD');
            filtro.criterio2 = filtro.condicion == 'between' ? moment(filtro.criterio2).format('YYYY-MM-DD') : '';
          }
          filtro.criterio1 = filtro.condicion == 'like' ? `%${filtro.criterio1}%` : filtro.criterio1;
        }
        return this.service.getAll(busqueda);
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
        columna: ['descripcion'], criterios: this.fb.array([]), criterio1: [''], criterio2: [''], condicion: ['like']
      })
    );
  }

  deleteFiltro = (index: number) => this.filtros.length > 1 ? this.filtros.removeAt(index) : null;

  esFecha(filtro: FormControl) {
    const column: string = filtro.get('columna').value;
    return column == 'fec_ing' || column == 'fec_mod';
  }

  clearCriterio1 = (filtro: FormControl) => filtro.get('criterio1').setValue('');

  clearCriterio2 = (filtro: FormControl) => filtro.get('criterio2').setValue('');

  clearCriterios(filtro: FormControl) {
    this.clearCriterio1(filtro);
    this.clearCriterio2(filtro);
    this.criterios(filtro).clear();
  }

  updateEstado(proveedor: Proveedor) {
    const cloneProveedor = Object.assign({}, proveedor);
    cloneProveedor.estado = cloneProveedor.estado == 1 ? 0 : 1;
    this.service.setStatus(cloneProveedor).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.form.getRawValue().estado == 2) {
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
      width: '720px', data: proveedor
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
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