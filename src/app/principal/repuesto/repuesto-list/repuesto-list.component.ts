import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PrintingService } from '@shared/printing.service';
import { RepuestoService }  from '../repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaFactory, BusquedaBuilder, busquedaRepuesto, PrintBusqueda } from '@models/busqueda';
import { Repuesto } from '@models/entity';
import { RepuestoForm } from '@models/form';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { RepuestoDetailComponent } from './repuesto-detail/repuesto-detail.component';
import { RepuestoReporteComponent } from './repuesto-reporte/repuesto-reporte.component';
import { detailExpand } from '@animations/detailExpand';
import { PrintContextComponent } from './repuesto-print/print-context/print-context.component';

@Component({
  selector: 'app-repuesto-list',
  templateUrl: './repuesto-list.component.html',
  styleUrls: ['./repuesto-list.component.css'],
  animations: detailExpand
})
export class RepuestoListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly mobileColumns: string[] = ['opciones', 'Codigo', 'Modelo', 'Stock', 'Precio', 'accion'];
  readonly normalColumns: string[] = ['opciones', 'Codigo', 'Categoria.Descripcion', 'Marca.Descripcion', 'Modelo', 
    'Epoca', 'Stock', 'Precio', 'Stock * Precio', 'accion'];
  builder: BusquedaFactory =  null;
  busqueda: BusquedaBuilder = { rootBusqueda: busquedaRepuesto };
  customEvent = new Subject();
  customEvent$ = this.customEvent.asObservable();
  data: Repuesto[] = [];
  expandedElement: Repuesto = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  isTrash: boolean = true;
  resultsLength: number = 0;
  resultsStock: number = 0;
  resultsPrecio: number = 0;
  resultsTotal: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private printing: PrintingService,
    private router: Router,
    private service: RepuestoService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Repuestos', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  get columns() {
    return this.isMobile ? this.mobileColumns : this.normalColumns;
  }

  ngOnInit(): void {
    this.activedRoute.queryParamMap.subscribe(params => {
      const busqueda: Busqueda = JSON.parse(params.get('busqueda'));
      if(busqueda) {
        this.busqueda.nextBusqueda = busqueda;
        this.initSearch();
      }
    });
    this.activedRoute.paramMap.subscribe(params => {
      const criterio: string = params.get('id');
      if(criterio) {
        const busqueda: Busqueda = { 
          estado: true, operadorLogico: '||', filtros: [
            { id: 'Codigo', criterios: [criterio], operador: 'contiene' },
            { id: 'Modelo', criterios: [criterio], operador: 'contiene' },
            { id: 'SubMarca', criterios: [criterio], operador: 'contiene' },
            { id: 'Categoria.Descripcion', criterios: [criterio], operador: 'contiene' },
            { id: 'Marca.Descripcion', criterios: [criterio], operador: 'contiene' },
            { id: 'Descripcion', criterios: [criterio], operador: 'contiene' }
          ]
        };
        this.busqueda.nextBusqueda = busqueda;
        this.initSearch();
      }
    });
  }

  ngAfterViewInit(): void {
    this.builder = new BusquedaFactory(this.customEvent$, this.paginator, this.sort);
    merge(this.customEvent$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        this.busqueda.nextBusqueda = this.builder.newBusqueda(this.busqueda.nextBusqueda);
        return this.service.getAll(this.busqueda.nextBusqueda);
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        this.resultsStock = response.body.stock;
        this.resultsPrecio = response.body.precio;
        this.resultsTotal = response.body.total;
        return response.body.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  buildBusquedaForm(repuestoForm: RepuestoForm): BusquedaBuilder {
    for(let filtro of this.busqueda.rootBusqueda.filtros) {
      switch(filtro.nombre) {
        case 'Marca': filtro.data = repuestoForm.marcas.map(marca => marca.descripcion); break
        case 'Categoría': filtro.data = repuestoForm.categorias.map(categoria => categoria.descripcion); break;
      }
    }
    return this.busqueda;
  }

  changeEstado() {
    this.busqueda.nextBusqueda.estado = !this.busqueda.nextBusqueda.estado;
    this.initSearch();
  }

  delete(repuesto: Repuesto) {
    this.service.delete(repuesto).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != repuesto.id);
        this.sharedService.showMessage(response.body.texto);
      }
    });
  }

  openConfirmation(repuesto: Repuesto) {
    const data = { mensaje: "¿Está seguro de que desea eliminar definitivamente este repuesto?", accion: "Eliminar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(repuesto) : this.sharedService.showWarningMessage('No se han aplicado los cambios');
    });
  }

  openFilter() {
    this.service.getForm().subscribe(form => {
      const dialogRef = this.dialog.open(FiltroComponent, {
        width: '720px', autoFocus: false, disableClose: true, data: this.buildBusquedaForm(form), restoreFocus: false
      });
      dialogRef.afterClosed().subscribe((result: Busqueda) => {
        if(result) {
          const extras: NavigationExtras = {
            queryParams: { busqueda: JSON.stringify(result) }, skipLocationChange: true 
          };
          this.router.navigate(['/principal/repuestos'], extras);
        }
      });
    });
  }

  openForm(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: repuesto
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openPrint() {
    const dialogRef = this.dialog.open(PrintContextComponent, {
      width: '520px', autoFocus: false, disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: PrintBusqueda) => {
      if(result) {
        result.busqueda = this.builder.newBusqueda(this.busqueda.nextBusqueda);
        result.busqueda.pagina = 0;
        result.busqueda.cantidad = this.resultsLength;
        this.printing.printWindow(this.router.url, result);
      } else {
        this.sharedService.showWarningMessage('La operación ha sido cancelada');
      }
    });
  }

  openReporte(repuesto: Repuesto) {
    this.dialog.open(RepuestoReporteComponent, {
      width: '720px', autoFocus: false, data: repuesto
    });
  }

  reload() {
    if(this.busqueda.nextBusqueda.operadorLogico == '&&') {
      this.busqueda.nextBusqueda = null;
      this.initSearch();
    } else {
      this.router.navigate(['/principal/repuestos']);
    }
  }

  updateEstado(repuesto: Repuesto) {
    const clone: Repuesto = Object.assign({}, repuesto);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != repuesto.id);
        this.sharedService.showMessage(response.body.texto);
      }
    });
  }

  initSearch = () => this.customEvent.next();
}