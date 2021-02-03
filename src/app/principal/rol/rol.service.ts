import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Rol, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class RolService {
  readonly url: string = 'http://192.168.1.126:8080/api/roles';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RolService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Rol>>('getAll')));

  insertOrUpdate = (rol: Rol) => this.http.post(this.url, rol, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', rol)));

  setStatus = (rol: Rol) => this.http.post(`${this.url}/${rol.id}/status`, rol, httpOptions)
      .pipe(catchError(this.handleError('setStatus', rol)));

  delete = (rol: Rol) => this.http.post(`${this.url}/${rol.id}/delete`, rol, httpOptions)
      .pipe(catchError(this.handleError('delete', rol)));
}