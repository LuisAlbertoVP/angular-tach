import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Respuesta, urlRol } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Rol, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RolService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Rol>>(`${urlRol}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Rol>>>('getAll')));

  insertOrUpdate = (rol: Rol) => this.http.post<Respuesta>(urlRol, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('insertOrUpdate')));

  setStatus = (rol: Rol) => this.http.post<Respuesta>(`${urlRol}/${rol.id}/status`, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('setStatus')));

  delete = (rol: Rol) => this.http.post<Respuesta>(`${urlRol}/${rol.id}/delete`, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Respuesta>>('delete')));
}