import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '@shared_service/shared';
import { MarcaService }  from '../marca.service';
import { Base, Marcas } from '@models/tach';
import { Busqueda, busquedaBase } from '@models/busqueda';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MarcaDetailComponent } from './marca-detail/marca-detail.component';
import * as moment from 'moment';
import { FiltroComponent } from '../../shared/filtro/filtro.component';

@Component({
  selector: 'app-marca-list',
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css']
})
export class MarcaListComponent implements OnInit, AfterViewInit {
  @ViewChild('btnSearch', { read: ElementRef }) button: ElementRef;
  @ViewChild(MatRadioGroup) radio: MatRadioGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly displayedColumns: string[] = ['opciones', 'descripcion', 'ingreso', 'modificacion', 'accion'];
  busqueda: Busqueda = busquedaBase;
  data: Base[] = [];
  resultsLength: number = 0;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;

  constructor(
    sharedService: SharedService,
    private service: MarcaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { 
    sharedService.buildMenuBar({ title: 'Marcas', addEvent: () => this.openFilter() });
  }

  get newBusqueda() {
    let busqueda: Busqueda = { filtros: [], estado: this.busqueda.estado };
    const activo = this.sort.active ? this.sort.active : 'fec_mod';
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    for(let filtro of this.busqueda.filtros) {
      if(filtro.checked) {
        if(filtro.esFecha) {
          filtro.criterio1 = moment(filtro.criterio1).format('YYYY-MM-DD');
          filtro.criterio2 = filtro.condicion == 'between' ? moment(filtro.criterio2).format('YYYY-MM-DD') : '';
        }
        filtro.criterio1 = filtro.condicion == 'like' ? `%${filtro.criterio1}%` : filtro.criterio1;
        busqueda.filtros.push(filtro);
      }
    }
    return busqueda;
  }

  ngOnInit(): void {
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
        const marcas: Marcas = (data as HttpResponse<Marcas>).body;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = marcas.total;
        return marcas.marcas;
      }), catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })).subscribe(data => this.data = data);
  }

  reload() {
    this.busqueda = busquedaBase;
    this.initSearch();
  }

  initSearch = () => this.button.nativeElement.click();

  updateEstado(marca: Base) {
    const cloneMarca = Object.assign({}, marca);
    cloneMarca.estado = cloneMarca.estado ? false : true;
    this.service.setStatus(cloneMarca).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        if(this.busqueda.estado == '2') {
          marca.estado = cloneMarca.estado;
        } else {
          this.data = this.data.filter(oldMarca => oldMarca.id != marca.id);
        }
        this.showMessage(response.body);
      }
    });
  }

  openDialog(marca?: Base) {
    const dialogRef = this.dialog.open(MarcaDetailComponent, {
      width: '520px', autoFocus: false, disableClose: true, data: marca
    });
    dialogRef.afterClosed().subscribe(result => result ? this.initSearch() : null);
  }

  openFilter() {
    const dialogRef = this.dialog.open(FiltroComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: this.busqueda
    });
    dialogRef.afterClosed().subscribe(result => {
      this.busqueda = result ? result : this.busqueda;
      this.initSearch();
    });
  }

  delete(marca: Base) {
    this.service.delete(marca).subscribe((response: HttpResponse<string>) => {
      if(response?.status == 200) {
        this.data = this.data.filter(oldMarca => oldMarca.id != marca.id);
        this.showMessage(response.body);
      }
    });
  }

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
}