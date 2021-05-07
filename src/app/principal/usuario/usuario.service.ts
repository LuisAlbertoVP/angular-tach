import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, server } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, Table } from '@models/entity';
import { UserForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly url: string = server.host + '/usuarios';
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('UsuarioService');
  }

  getForm = (): Observable<UserForm> => this.http.get<UserForm>(`${this.url}/form`)
      .pipe(catchError(this.handleError<UserForm>('getForm')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<User>>(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<User>>>('getAll')));

  insertOrUpdate = (user: User) => this.http.post<Mensaje>(this.url, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (user: User) => this.http.post<Mensaje>(`${this.url}/${user.id}/status`, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (user: User) => this.http.post<Mensaje>(`${this.url}/${user.id}/delete`, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}