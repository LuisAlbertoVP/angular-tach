import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { RepuestoService }  from '../repuesto.service';
import { Repuesto, Repuestos } from '@models/tach';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { RepuestoDetailComponent } from './repuesto-detail/repuesto-detail.component';
import { ConfirmacionComponent } from '../../shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';
import { PrintingService } from '@print_service/*';

@Component({
  selector: 'app-repuesto-list',
  templateUrl: './repuesto-list.component.html',
  styleUrls: ['./repuesto-list.component.css'],
  animations: detailExpand
})
export class RepuestoListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  readonly mobileColumns: string[] = ['opciones', 'Codigo', 'Modelo', 'Stock', 'Precio', 'accion'];
  readonly normalColumns: string[] = ['opciones', 'Codigo', 'Categoria.Descripcion', 'Marca.Descripcion', 
    'Modelo', 'Stock', 'Precio', 'Epoca', 'SubMarca', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildRepuesto();
  criterio = new Subject();
  data: Repuesto[] = [];
  expandedElement: Repuesto = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private printing: PrintingService,
    private router: Router,
    private service: RepuestoService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Repuestos', filterEvent: () => this.openFilter(),
      printEvent: () => this.openPrint() });
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
    if(busqueda.operadorLogico == '&&') {
      busqueda.filtros.push({ id: "Id", criterio1: '', operador: 'like' });
    }
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
    this.activedRoute.paramMap.subscribe(params => {
      const criterio: string = params.get('id');
      if(criterio) {
        this.busqueda = { estado: '2', operadorLogico: '||', filtros: [] };
        this.busqueda.filtros.push(
          { id: 'Codigo', criterio1: criterio, operador: 'like', checked: true },
          { id: 'Modelo', criterio1: criterio, operador: 'like', checked: true }
        );
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
        const repuestos: Repuestos = (data as HttpResponse<Repuestos>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = repuestos.total;
        return repuestos.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  delete(repuesto: Repuesto) {
    this.service.delete(repuesto).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldRepuesto => oldRepuesto.id != repuesto.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/repuestos'], extras);
  }

  openConfirmation(repuesto: Repuesto) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, 
      data: '¿Está seguro de que desea eliminar este repuesto?'
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(repuesto) : this.sharedService.showMessage('No se han aplicado los cambios');
    });
  }

  openFilter() {
    const busqueda: Busqueda = this.busqueda.operadorLogico == '&&' ? this.busqueda : 
      BusquedaBuilder.BuildRepuesto();
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.navigateToPrincipal(result);
      }
    });
  }

  openForm(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: repuesto
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openPrint() {
    const busqueda: Busqueda = this.newBusqueda;
    busqueda.pagina = 0;
    busqueda.cantidad = this.resultsLength;
    this.printing.printWindow(this.router.url, busqueda);
  }

  reload() {
    if(this.busqueda.operadorLogico == '&&') {
      const busqueda: Busqueda = BusquedaBuilder.BuildRepuesto();
      busqueda.estado = this.busqueda.estado;
      this.navigateToPrincipal(busqueda);
    } else {
      this.router.navigate(['/principal/repuestos']);
    }
  }

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
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
}