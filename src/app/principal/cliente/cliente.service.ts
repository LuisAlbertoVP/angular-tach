import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, urlCliente } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente, Table, Venta } from '@models/entity';
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

  getVentas = (id: string): Observable<Venta[]> => this.http.get<Venta[]>(`${urlCliente}/${id}/ventas`)
      .pipe(catchError(this.handleError<Venta[]>('getVentas')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Cliente>>(`${urlCliente}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Cliente>>>('getAll')));

  insertOrUpdate = (cliente: Cliente) => this.http.post<Mensaje>(urlCliente, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (cliente: Cliente) => this.http.post<Mensaje>(`${urlCliente}/${cliente.id}/status`, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (cliente: Cliente) => this.http.post<Mensaje>(`${urlCliente}/${cliente.id}/delete`, cliente, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}