import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Respuesta, urlCompra } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Compra, Table } from '@models/entity';
import { CompraForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CompraService');
  }

  getCompra = (id: string): Observable<CompraForm> => this.http.get<CompraForm>(`${urlCompra}/${id}`)
      .pipe(catchError(this.handleError<CompraForm>('get')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Compra>>(`${urlCompra}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Compra>>>('getAll')));

  insertOrUpdate = (compra: Compra) => this.http.post<Respuesta>(urlCompra, compra, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('insertOrUpdate')));

  setStatus = (compra: Compra) => this.http.post<Respuesta>(`${urlCompra}/${compra.id}/status`, compra, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('setStatus')));
}