import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserForm, Users } from '@models/auth';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  readonly url: string = 'http://localhost:8080/api/usuarios';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('UsuarioService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Users>('getAll')));

  getForm = (): Observable<UserForm> => this.http.get<UserForm>(`${this.url}/form`)
      .pipe(catchError(this.handleError<UserForm>('getForm')));

  insertOrUpdate = (user: User) => this.http.post(this.url, user, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', user)));

  setStatus = (user: User) => this.http.post(`${this.url}/${user.id}/status`, user, httpOptions)
      .pipe(catchError(this.handleError('setStatus', user)));

  delete = (user: User) => this.http.post(`${this.url}/${user.id}/delete`, user, httpOptions)
      .pipe(catchError(this.handleError('delete', user)));
}