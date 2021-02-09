import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlCompra } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Compra, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CompraService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlCompra}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Compra>>('getAll')));

  insertOrUpdate = (compra: Compra) => this.http.post(urlCompra, compra, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', compra)));

  setStatus = (compra: Compra) => this.http.post(`${urlCompra}/${compra.id}/status`, compra, httpOptions)
      .pipe(catchError(this.handleError('setStatus', compra)));
}