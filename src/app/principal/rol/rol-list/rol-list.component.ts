import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RolService }  from '../rol.service';
import { SharedService } from '@shared/shared.service';
import { Busqueda, BusquedaBuilder } from '@models/busqueda';
import { ConfirmationData } from '@models/confirmacion';
import { Rol } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { RolDetailComponent } from './rol-detail/rol-detail.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.css'],
  animations: detailExpand
})
export class RolListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly displayedColumns: string[] = ['opciones', 'Descripcion', 'FechaModificacion', 'accion'];
  busqueda: Busqueda = BusquedaBuilder.BuildBase();
  criterio = new Subject();
  criterio$ = this.criterio.asObservable();
  data: Rol[] = [];
  expandedElement: Rol = null;
  isLoadingResults: boolean = true;
  isMobile: boolean = false;
  isRateLimitReached: boolean = false;
  resultsLength: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: RolService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Roles', filterEvent: () => this.openFilter() });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
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
    const builder = new BusquedaBuilder(this.criterio$, this.paginator, this.sort);
    merge(this.criterio$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoadingResults = true;
        return this.service.getAll(builder.newBusqueda(this.busqueda));
      }), map(response => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.body.cantidad;
        return response.body.data;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

  changeEstado() {
    this.busqueda.estado = !this.busqueda.estado;
    this.initSearch();
  }

  delete(rol: Rol) {
    this.service.delete(rol).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != rol.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  navigateToPrincipal(busqueda: Busqueda) {
    busqueda.tiempo = Date.now();
    const extras: NavigationExtras = { 
      queryParams: { busqueda: JSON.stringify(busqueda) }, skipLocationChange: true 
    };
    this.router.navigate(['/principal/roles'], extras);
  }

  openConfirmation(rol: Rol) {
    const data: ConfirmationData = { seccion: "Roles", accion: "Eliminar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(rol) : this.sharedService.showWarningMessage('No se han aplicado los cambios');
    });
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda, restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.navigateToPrincipal(result);
    });
  }

  openForm(rol?: Rol) {
    const dialogRef = this.dialog.open(RolDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: rol
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  reload() {
    const busqueda: Busqueda = BusquedaBuilder.BuildBase();
    busqueda.estado = this.busqueda.estado;
    this.navigateToPrincipal(busqueda);
  }

  updateEstado(rol: Rol) {
    const clone: Rol = Object.assign({}, rol);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.data = this.data.filter(old => old.id != rol.id);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  initSearch = () => this.criterio.next();
}