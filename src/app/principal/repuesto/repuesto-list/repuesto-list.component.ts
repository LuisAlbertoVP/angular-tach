import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PrintingService } from '@shared/printing.service';
import { RepuestoService }  from '../repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { ConfirmationData } from '@models/confirmacion';
import { Repuesto } from '@models/entity';
import { RepuestoForm } from '@models/form';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { RepuestoDetailComponent } from './repuesto-detail/repuesto-detail.component';
import { detailExpand } from '@animations/detailExpand';

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
  readonly normalColumns: string[] = ['opciones', 'Codigo', 'Categoria.Descripcion', 'Marca.Descripcion', 
    'Modelo', 'Epoca', 'SubMarca', 'Stock', 'Precio', 'accion'];
  builder: BusquedaBuilder =  null;
  busqueda: Busqueda = BusquedaBuilder.BuildRepuesto();
  criterio = new Subject();
  criterio$ = this.criterio.asObservable();
  data: Repuesto[] = [];
  expandedElement: Repuesto = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;
  resultsStock: number = 0;
  resultsPrecio: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private printing: PrintingService,
    private router: Router,
    private service: RepuestoService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Repuestos', filterEvent: () => this.openFilter(),
      printEvent: () => this.openPrint() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  get columns() {
    return this.isMobile ? this.mobileColumns : this.normalColumns;
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
        this.busqueda = { estado: true, operadorLogico: '||', filtros: [] };
        this.busqueda.filtros.push(
          { id: 'Codigo', criterios: [criterio], operador: 'contiene', checked: true },
          { id: 'Modelo', criterios: [criterio], operador: 'contiene', checked: true }
        );
        this.initSearch();
      }
    });
  }

  ngAfterViewInit(): void {
    this.builder = new BusquedaBuilder(this.criterio$, this.paginator, this.sort);
    merge(this.criterio$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;  
        return this.service.getAll(this.builder.newBusqueda(this.busqueda));
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        this.resultsStock = response.body.stock;
        this.resultsPrecio = response.body.precio;
        return response.body.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  buildBusquedaForm(repuestoForm: RepuestoForm): Busqueda {
    const busqueda: Busqueda = this.busqueda.operadorLogico == '&&' ? this.busqueda : BusquedaBuilder.BuildRepuesto();
    for(let filtro of busqueda.filtros) {
      switch(filtro.nombre) {
        case 'Marca': filtro.data = repuestoForm.marcas.map(marca => marca.descripcion); break
        case 'Categoría': filtro.data = repuestoForm.categorias.map(categoria => categoria.descripcion); break;
      }
    }
    return busqueda;
  }

  changeEstado() {
    this.busqueda.estado = !this.busqueda.estado;
    this.initSearch();
  }

  delete(repuesto: Repuesto) {
    this.service.delete(repuesto).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != repuesto.id);
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
    const data: ConfirmationData = { seccion: "Repuestos", accion: "Eliminar" };
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
      dialogRef.afterClosed().subscribe(result => {
        if(result) this.navigateToPrincipal(result);
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
    const busqueda: Busqueda = this.builder.newBusqueda(this.busqueda);
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
    const clone: Repuesto = Object.assign({}, repuesto);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != repuesto.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
}