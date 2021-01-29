import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { MarcaService }  from '../marca.service';
import { Base, Bases } from '@models/tach';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { detailExpand } from '@animations/detailExpand';
import { MatDialog } from '@angular/material/dialog';
import { MarcaDetailComponent } from './marca-detail/marca-detail.component';
import { ConfirmacionComponent } from '../../shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '../../shared/filtro/filtro.component';
import * as moment from 'moment';

@Component({
  selector: 'app-marca-list',
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css'],
  animations: detailExpand
})
export class MarcaListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'Repuestos.Count', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildBase();
  criterio = new Subject();
  data: Base[] = [];
  expandedElement: Base = null;
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private service: MarcaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { 
    sharedService.buildMenuBar({ title: 'Marcas', filterEvent: () => this.openFilter() });
  }

  get newBusqueda() {
    let busqueda: Busqueda = { filtros: [], estado: this.busqueda.estado, operadorLogico: this.busqueda.operadorLogico };
    const activo = this.sort.active ? this.sort.active : 'FechaModificacion';
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    busqueda.filtros.push({ id: "Id", criterio1: '', operador: 'like' });
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
        const marcas: Bases = (data as HttpResponse<Bases>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = marcas.total;
        return marcas.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  updateEstado(marca: Base) {
    const cloneMarca = Object.assign({}, marca);
    cloneMarca.estado = cloneMarca.estado ? false : true;
    this.service.setStatus(cloneMarca).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          marca.estado = cloneMarca.estado;
        } else {
          this.data = this.data.filter(oldMarca => oldMarca.id != marca.id);
        }
        this.showMessage(response.body.result);
      }
    });
  }

  delete(marca: Base) {
    this.service.delete(marca).subscribe((response: HttpResponse<any>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldMarca => oldMarca.id != marca.id);
        this.showMessage(response.body.result);
      }
    });
  }

  openForm(marca?: Base) {
    const dialogRef = this.dialog.open(MarcaDetailComponent, {
      width: '520px', autoFocus: false, disableClose: true, data: marca
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openConfirmation(marca: Base) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: '¿Está seguro de que desea eliminar esta marca?'
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(marca) : this.showMessage('No se han aplicado los cambios');
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
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true };
    this.router.navigate(['/principal/marcas'], extras);
  }

  reload() {
    const busqueda: Busqueda = BusquedaBuilder.BuildBase();
    busqueda.estado = this.busqueda.estado;
    this.navigateToPrincipal(busqueda);
  }

  initSearch = () => this.criterio.next();

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}