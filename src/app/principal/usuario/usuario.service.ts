import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlUsuario } from '@models/http';
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
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('UsuarioService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlUsuario}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<User>>('getAll')));

  getForm = (): Observable<UserForm> => this.http.get<UserForm>(`${urlUsuario}/form`)
      .pipe(catchError(this.handleError<UserForm>('getForm')));

  insertOrUpdate = (user: User) => this.http.post(urlUsuario, user, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', user)));

  setStatus = (user: User) => this.http.post(`${urlUsuario}/${user.id}/status`, user, httpOptions)
      .pipe(catchError(this.handleError('setStatus', user)));

  delete = (user: User) => this.http.post(`${urlUsuario}/${user.id}/delete`, user, httpOptions)
      .pipe(catchError(this.handleError('delete', user)));
}