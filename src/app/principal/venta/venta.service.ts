import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlVenta } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Venta, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('VentaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlVenta}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Venta>>('getAll')));

  insertOrUpdate = (venta: Venta) => this.http.post(urlVenta, venta, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', venta)));

  setStatus = (venta: Venta) => this.http.post(`${urlVenta}/${venta.id}/status`, venta, httpOptions)
      .pipe(catchError(this.handleError('setStatus', venta)));
}