import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlCliente } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Cliente, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ClienteService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlCliente}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Cliente>>('getAll')));

  insertOrUpdate = (cliente: Cliente) => this.http.post(urlCliente, cliente, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', cliente)));

  setStatus = (cliente: Cliente) => this.http.post(`${urlCliente}/${cliente.id}/status`, cliente, httpOptions)
      .pipe(catchError(this.handleError('setStatus', cliente)));

  delete = (cliente: Cliente) => this.http.post(`${urlCliente}/${cliente.id}/delete`, cliente, httpOptions)
      .pipe(catchError(this.handleError('delete', cliente)));
}