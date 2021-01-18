import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { RepuestoService }  from '../repuesto.service';
import { Repuesto, Repuestos } from '@models/tach';
import { Busqueda, busquedaRepuesto } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { RepuestoDetailComponent } from './repuesto-detail/repuesto-detail.component';
import { PrintingService } from '@print_service/*';
import { FiltroComponent } from '../../shared/filtro/filtro.component';

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
  readonly normalColumns: string[] = ['opciones', 'codigo', 'categoria.descripcion', 'marca.descripcion', 'modelo', 'epoca', 'stock', 'precio', 'accion'];
  readonly mobileColumns: string[] = ['opciones', 'codigo', 'modelo', 'stock', 'precio', 'accion'];
  isMobile: boolean = false;
  busqueda: Busqueda = busquedaRepuesto;
  data: Repuesto[] = [];
  expandedElement: Repuesto = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private service: RepuestoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private printing: PrintingService
  ) {
    sharedService.buildMenuBar({ title: 'Repuestos', addEvent: () => this.openFilter(),
      printEvent: () => this.printRepuestos() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }


  ngOnInit(): void {
  }

  get columns() {
    return this.isMobile ? this.mobileColumns : this.normalColumns;
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

  ngAfterViewInit(): void {
    const btnEvent = fromEvent(this.button.nativeElement, 'click');
    btnEvent.subscribe(e =>  this.paginator.pageIndex = 0);
    this.radio.change.subscribe(() => this.paginator.pageIndex = 0);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(btnEvent, this.radio.change, this.sort.sortChange, this.paginator.page).pipe(startWith({}), switchMap(() => {
        this.isLoadingResults = true;  
        return this.service.getAll(this.newBusqueda);
      }), map(data => {
        const repuestos: Repuestos = (data as HttpResponse<Repuestos>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = repuestos.total;
        return repuestos.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  reload() {
    this.busqueda = busquedaRepuesto;
    this.initSearch();
  }

  initSearch = () => this.button.nativeElement.click();

  updateEstado(repuesto: Repuesto) {
    const cloneRepuesto = Object.assign({}, repuesto);
    cloneRepuesto.estado = cloneRepuesto.estado ? false : true;
    this.service.setStatus(cloneRepuesto).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          repuesto.estado = cloneRepuesto.estado;
        } else {
          this.data = this.data.filter(oldRepuesto => oldRepuesto.id != repuesto.id);
        }
        this.showMessage(response.body.result);
      }
    });
  }

  openDialog(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: repuesto
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

  delete(repuesto: Repuesto) {
    this.service.delete(repuesto).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldRepuesto => oldRepuesto.id != repuesto.id);
        this.showMessage(response.body.result);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});

  printRepuestos() {
    const busqueda: Busqueda = this.newBusqueda;
    busqueda.pagina = 0;
    busqueda.cantidad = this.resultsLength;
    this.printing.printWindow('/principal/repuestos/print', busqueda);
  }
}