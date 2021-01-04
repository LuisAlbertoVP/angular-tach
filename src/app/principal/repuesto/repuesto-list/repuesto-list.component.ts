import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedService } from '@shared_service/shared';
import { RepuestoService }  from '../repuesto.service';
import { Option, optionsRepuestos } from '@models/options';
import { Repuesto, Repuestos } from '@models/tach';
import { Busqueda } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RepuestoDetailComponent } from './repuesto-detail/repuesto-detail.component';
import * as moment from 'moment';
import { PrintingService } from '@print_service/*';

@Component({
  selector: 'app-repuesto-list',
  templateUrl: './repuesto-list.component.html',
  styleUrls: ['./repuesto-list.component.css'],
  animations: detailExpand
})
export class RepuestoListComponent implements OnInit, AfterViewInit {
  @ViewChild('btnSearch', { read: ElementRef }) button: ElementRef;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly normalColumns: string[] = ['opciones', 'codigo', 'marca', 'categoria', 'modelo', 'fecha', 'stock', 'precio', 'accion'];
  readonly mobileColumns: string[] = ['opciones', 'codigo', 'modelo', 'stock', 'precio', 'accion'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isMobile: boolean = false;
  options: Option[] = optionsRepuestos;
  data: Repuesto[] = [];
  expandedElement: Repuesto = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  form = this.fb.group({
    filtros: this.fb.array([]),
    estado: ['2']
  });

  constructor(
    sharedService: SharedService,
    private service: RepuestoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private printing: PrintingService
  ) {
    sharedService.buildMenuBar({ title: 'Repuestos', addEvent: () => this.openDialog(),
      printEvent: () => this.printRepuestos() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  ngOnInit(): void {
    this.addFiltro();
  }

  get columns() {
    return this.isMobile ? this.mobileColumns : this.normalColumns;
  }

  get busqueda() {
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
      filtro.isRelation = filtro.columna == 'marca' || filtro.columna == 'categoria' ? true : false;
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
        return this.service.getAll(this.busqueda);
      }), map(data => {
        const repuestos: Repuestos = (data as HttpResponse<Repuestos>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = repuestos.total;
        return repuestos.repuestos;
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
        columna: ['codigo'], criterios: this.fb.array([]), criterio1: [''], criterio2: [''], condicion: ['like']
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

  updateEstado(repuesto: Repuesto) {
    const cloneRepuesto = Object.assign({}, repuesto);
    cloneRepuesto.estado = cloneRepuesto.estado == 1 ? 0 : 1;
    this.service.setStatus(cloneRepuesto).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.form.getRawValue().estado == 2) {
          repuesto.estado = cloneRepuesto.estado;
        } else {
          this.data = this.data.filter(oldRepuesto => oldRepuesto.id != repuesto.id);
        }
        this.showMessage(response.body);
      }
    });
  }

  openDialog(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoDetailComponent, {
      width: '720px', data: repuesto
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  delete(repuesto: Repuesto) {
    this.service.delete(repuesto).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldRepuesto => oldRepuesto.id != repuesto.id);
        this.showMessage(response.body);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});

  printRepuestos() {
    const busqueda: Busqueda = this.busqueda;
    busqueda.pagina = 0;
    busqueda.cantidad = this.resultsLength;
    this.printing.printWindow('/principal/repuestos/print', busqueda);
  }
}