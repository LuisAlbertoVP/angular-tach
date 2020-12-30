import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from '../http-error-handler.service';
import { User } from '@models/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = 'http://localhost:8080/api';
  private handleError: HandleError;

  constructor(
    private http: HttpClient, 
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  addUser = (user: User) => this.http.post(`${this.url}/usuarios/request`, user, httpOptions)
      .pipe(catchError(this.handleError('addUser', user)));

  changePassword = (user: User) => this.http.post(`${this.url}/usuarios/update`, user, httpOptions)
      .pipe(catchError(this.handleError('changePassword', user)));

  login = (user: User) => this.http.post(`${this.url}/login`, user, httpOptions)
      .pipe(catchError(this.handleError('login', user)));

  getRolUser = (id: string): Observable<User> => this.http.get<User>(`${this.url}/usuarios/${id}/roles`)
      .pipe(catchError(this.handleError<User>('getRolUser')));

  saveToken(user: User) {
    localStorage.setItem('id', user.id);
    localStorage.setItem('nombreUsuario', user.nombreUsuario);
    localStorage.setItem('nombres', user.nombres);
    localStorage.setItem('token_id', user.token.id);
    localStorage.setItem('token_expiration', user.token.expiration);
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('nombres');
    localStorage.removeItem('token_id');
    localStorage.removeItem('token_expiration');
  }

  get id() {
    return localStorage.getItem('id');
  }

  get nombreUsuario() {
    return localStorage.getItem('nombreUsuario');
  }

  get nombres() {
    return localStorage.getItem('nombres');
  }

  get token() { 
    return localStorage.getItem('token_id'); 
  }

  get tokenExpiration() {
    return localStorage.getItem('token_expiration');
  }
}