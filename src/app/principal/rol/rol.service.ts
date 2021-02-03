import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlRol } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Rol, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RolService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlRol}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Rol>>('getAll')));

  insertOrUpdate = (rol: Rol) => this.http.post(urlRol, rol, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', rol)));

  setStatus = (rol: Rol) => this.http.post(`${urlRol}/${rol.id}/status`, rol, httpOptions)
      .pipe(catchError(this.handleError('setStatus', rol)));

  delete = (rol: Rol) => this.http.post(`${urlRol}/${rol.id}/delete`, rol, httpOptions)
      .pipe(catchError(this.handleError('delete', rol)));
}