import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Response, urlProveedor } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Proveedor, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ProveedorService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Proveedor>>(`${urlProveedor}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Proveedor>>>('getAll')));

  insertOrUpdate = (proveedor: Proveedor) => this.http.post<Response>(urlProveedor, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Response>>('insertOrUpdate')));

  setStatus = (proveedor: Proveedor) => this.http.post<Response>(`${urlProveedor}/${proveedor.id}/status`, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Response>>('setStatus')));

  delete = (proveedor: Proveedor) => this.http.post<Response>(`${urlProveedor}/${proveedor.id}/delete`, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Response>>('delete')));
}