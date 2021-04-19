import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CategoriaService }  from '../categoria.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaFactory, BusquedaBuilder, busquedaBase } from '@models/busqueda';
import { Categoria } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { CategoriaDetailComponent } from './categoria-detail/categoria-detail.component';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css'],
  animations: detailExpand
})
export class CategoriaListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'Repuestos.Sum(Stock)',
    'Repuestos.Sum(Stock * Precio)', 'accion'];
  busqueda: BusquedaBuilder = { rootBusqueda: busquedaBase };
  customEvent = new Subject();
  customEvent$ = this.customEvent.asObservable();
  data: Categoria[] = [];
  expandedElement: Categoria = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  isTrash: boolean = true;
  resultsLength: number = 0;
  resultsStock: number = 0;
  resultsTotal: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: CategoriaService,
    public sharedService: SharedService
  ) { 
    sharedService.buildMenuBar({ title: 'Categorías', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.activedRoute.queryParamMap.subscribe(params => {
      const busqueda: Busqueda = JSON.parse(params.get('busqueda'));
      if(busqueda) {
        this.busqueda.nextBusqueda = busqueda;
        this.initSearch();
      }
    });
  }

  ngAfterViewInit(): void {
    const builder = new BusquedaFactory(this.customEvent$, this.paginator, this.sort);
    merge(this.customEvent$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        this.busqueda.nextBusqueda = builder.newBusqueda(this.busqueda.nextBusqueda);
        return this.service.getAll(this.busqueda.nextBusqueda);
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        this.resultsStock = response.body.stock;
        this.resultsTotal = response.body.total;
        return response.body.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  changeEstado() {
    this.busqueda.nextBusqueda.estado = !this.busqueda.nextBusqueda.estado;
    this.initSearch();
  }

  delete(categoria: Categoria) {
    this.service.delete(categoria).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != categoria.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  openConfirmation(categoria: Categoria) {
    const data = { mensaje: "¿Está seguro de que desea eliminar definitivamente esta categoría?", accion: "Eliminar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(categoria) : this.sharedService.showWarningMessage('No se han aplicado los cambios');
    });
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe((result: Busqueda) => {
      if(result) {
        const extras: NavigationExtras = { 
          queryParams: { busqueda: JSON.stringify(result) }, skipLocationChange: true 
        };
        this.router.navigate(['/principal/categorias'], extras);
      }
    });
  }

  openForm(categoria?: Categoria) {
    const dialogRef = this.dialog.open(CategoriaDetailComponent, {
      width: '520px', autoFocus: false, disableClose: true, data: categoria
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  reload() {
    this.busqueda.nextBusqueda = null;
    this.initSearch();
  }

  updateEstado(categoria: Categoria) {
    const clone: Categoria = Object.assign({}, categoria);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != categoria.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.customEvent.next();
}