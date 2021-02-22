import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Respuesta, urlCliente } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Cliente, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ClienteService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Cliente>>(`${urlCliente}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Cliente>>>('getAll')));

  insertOrUpdate = (cliente: Cliente) => this.http.post<Respuesta>(urlCliente, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('insertOrUpdate')));

  setStatus = (cliente: Cliente) => this.http.post<Respuesta>(`${urlCliente}/${cliente.id}/status`, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('setStatus')));

  delete = (cliente: Cliente) => this.http.post<Respuesta>(`${urlCliente}/${cliente.id}/delete`, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('delete')));
}