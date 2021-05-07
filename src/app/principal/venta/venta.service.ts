import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, server } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Venta, Table } from '@models/entity';
import { VentaForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private readonly url: string = server.host + '/ventas';
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('VentaService');
  }

  getForm = (id: string): Observable<VentaForm> => this.http.get<VentaForm>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError<VentaForm>('get')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Venta>>(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Venta>>>('getAll')));

  insertOrUpdate = (venta: Venta) => this.http.post<Mensaje>(this.url, venta, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (venta: Venta) => this.http.post<Mensaje>(`${this.url}/${venta.id}/status`, venta, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));
}