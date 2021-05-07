import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, server } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Rol, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private readonly url: string = server.host + '/roles';
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('RolService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Rol>>(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Rol>>>('getAll')));

  insertOrUpdate = (rol: Rol) => this.http.post<Mensaje>(this.url, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (rol: Rol) => this.http.post<Mensaje>(`${this.url}/${rol.id}/status`, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (rol: Rol) => this.http.post<Mensaje>(`${this.url}/${rol.id}/delete`, rol, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}