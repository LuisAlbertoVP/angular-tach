import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proveedor, Proveedores } from '@models/tach';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  readonly url: string = 'http://192.168.1.126:8080/api/proveedores';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ProveedorService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Proveedores>('getAll')));

  getById = (id: string): Observable<Proveedor> => this.http.get<Proveedor>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError<Proveedor>('getById')));

  insertOrUpdate = (proveedor: Proveedor) => this.http.post(this.url, proveedor, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', proveedor)));

  setStatus = (proveedor: Proveedor) => this.http.post(`${this.url}/${proveedor.id}/status`, proveedor, httpOptions)
      .pipe(catchError(this.handleError('setStatus', proveedor)));

  delete = (proveedor: Proveedor) => this.http.post(`${this.url}/${proveedor.id}/delete`, proveedor, httpOptions)
      .pipe(catchError(this.handleError('delete', proveedor)));
}