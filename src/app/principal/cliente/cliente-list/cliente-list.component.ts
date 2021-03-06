import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '@shared/shared.service';
import { ClienteService }  from '../cliente.service';
import { Busqueda, BusquedaFactory, BusquedaBuilder, busquedaCliente } from '@models/busqueda';
import { Cliente, Table, TipoCliente } from '@models/entity';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf, Subject } from 'rxjs';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { FiltroComponent } from '@shared/filtro/filtro.component';
import { ClienteDetailComponent } from './cliente-detail/cliente-detail.component';
import { ClienteRepuestoComponent } from './cliente-repuesto/cliente-repuesto.component';
import { detailExpand } from '@animations/detailExpand';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
  animations: detailExpand
})
export class ClienteListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly mobileColumns: string[] = ['opciones', 'Nombres', 'Ventas.Sum(VentaDetalle.Sum(Cantidad))', 'accion'];
  readonly normalColumns: string[] = ['opciones', 'Nombres', 'Telefono', 'Celular', 'Cedula', 
    'Ventas.Where(Estado==true).Sum(VentaDetalle.Sum(Cantidad))', 'accion'];
  busqueda: BusquedaBuilder = { rootBusqueda: busquedaCliente };
  customEvent = new Subject();
  customEvent$ = this.customEvent.asObservable();
  expandedElement: Cliente = null;
  isLoading: boolean = true;
  isMobile: boolean = false;
  isRateLimit: boolean = false;
  isActivated: boolean = true;
  table: Table<Cliente> = null;

  constructor(
    private activedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private service: ClienteService,
    public sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Clientes', filterEvent: () => this.openFilter() });
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
  }

  ngAfterViewInit(): void {
    const builder = new BusquedaFactory(this.customEvent$, this.paginator, this.sort);
    merge(this.customEvent$, this.sort.sortChange, this.paginator.page).pipe(
      startWith({}), switchMap(() => {
        this.isLoading = true;
        this.busqueda.nextBusqueda = builder.newBusqueda(this.busqueda.nextBusqueda, this.isActivated);
        return this.service.getAll(this.busqueda.nextBusqueda);
      }), map(response => {
        this.isLoading = false;
        this.isRateLimit = false;
        return response.body;
      }), catchError(() => {
        this.isLoading = false;
        this.isRateLimit = true;
        return observableOf([]);
      })
    ).subscribe((table: Table<Cliente>) => this.table = table);
  }

  changeEstado() {
    this.isActivated = !this.isActivated;
    this.initSearch();
  }

  delete(cliente: Cliente) {
    this.service.delete(cliente).subscribe(response => {
      if(response?.status == 200) {
        this.table.data = this.table.data.filter(old => old.id != cliente.id);
        this.sharedService.showMessage(response.body.texto);
      }
    });
  }

  openConfirmation(cliente: Cliente) {
    const data = { mensaje: "¿Está seguro de que desea eliminar definitivamente este cliente?", accion: "Eliminar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      return result ? this.delete(cliente) : this.sharedService.showWarningMessage('No se han aplicado los cambios');
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
        this.router.navigate(['/principal/clientes'], extras);
      }
    });
  }

  openForm(cliente?: Cliente) {
    const dialogRef = this.dialog.open(ClienteDetailComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: cliente
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openRepuesto(cliente: Cliente) {
    this.dialog.open(ClienteRepuestoComponent, {
      width: '720px', autoFocus: false, data: cliente
    });
  }

  reload() {
    this.busqueda.nextBusqueda = null;
    this.initSearch();
  }

  updateEstado(cliente: Cliente) {
    const clone: Cliente = Object.assign({}, cliente);
    clone.estado = clone.estado ? false : true;
    this.service.setStatus(clone).subscribe(response => {
      if(response?.status == 200) {
        this.table.data = this.table.data.filter(old => old.id != cliente.id);
        this.sharedService.showMessage(response.body.texto);
      }
    });
  }

  initSearch = () => this.customEvent.next();
  parseTipoCliente = (tipoCliente: TipoCliente) => TipoCliente[tipoCliente];
}