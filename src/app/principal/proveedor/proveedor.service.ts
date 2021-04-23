import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, urlProveedor } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Compra, Proveedor, Table } from '@models/entity';
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

  getCompras = (id: string): Observable<Compra[]> => this.http.get<Compra[]>(`${urlProveedor}/${id}/compras`)
      .pipe(catchError(this.handleError<Compra[]>('getCompras')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Proveedor>>(`${urlProveedor}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Proveedor>>>('getAll')));

  insertOrUpdate = (proveedor: Proveedor) => this.http.post<Mensaje>(urlProveedor, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (proveedor: Proveedor) => this.http.post<Mensaje>(`${urlProveedor}/${proveedor.id}/status`, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (proveedor: Proveedor) => this.http.post<Mensaje>(`${urlProveedor}/${proveedor.id}/delete`, proveedor, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}