import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlProveedor } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proveedor, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ProveedorService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlProveedor}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Proveedor>>('getAll')));

  getById = (id: string): Observable<Proveedor> => this.http.get<Proveedor>(`${urlProveedor}/${id}`)
      .pipe(catchError(this.handleError<Proveedor>('getById')));

  insertOrUpdate = (proveedor: Proveedor) => this.http.post(urlProveedor, proveedor, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', proveedor)));

  setStatus = (proveedor: Proveedor) => this.http.post(`${urlProveedor}/${proveedor.id}/status`, proveedor, httpOptions)
      .pipe(catchError(this.handleError('setStatus', proveedor)));

  delete = (proveedor: Proveedor) => this.http.post(`${urlProveedor}/${proveedor.id}/delete`, proveedor, httpOptions)
      .pipe(catchError(this.handleError('delete', proveedor)));
}