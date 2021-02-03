import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from '../http-error-handler.service';
import { User } from '@models/entity';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url: string = 'http://192.168.1.126:8080/api';
  private handleError: HandleError;

  constructor(
    private http: HttpClient, 
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  get id() {
    return localStorage.getItem('id');
  }

  get nombres() {
    return localStorage.getItem('nombres');
  }
  
  get nombreUsuario() {
    return localStorage.getItem('nombreUsuario');
  }

  get token() { 
    return localStorage.getItem('token_id'); 
  }

  get tokenExpiration() {
    return localStorage.getItem('token_expiration');
  }

  addAccount = (user: User) => this.http.post(`${this.url}/cuenta`, user, httpOptions)
      .pipe(catchError(this.handleError('addAccount', user)));

  getRolUser = (id: string): Observable<User> => this.http.get<User>(`${this.url}/cuenta/${id}/roles`)
      .pipe(catchError(this.handleError<User>('getRolUser')));

  login = (user: User) => this.http.post(`${this.url}/login`, user, httpOptions)
      .pipe(catchError(this.handleError('login', user)));

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('nombres');
    localStorage.removeItem('token_id');
    localStorage.removeItem('token_expiration');
  }

  saveToken(user: User) {
    localStorage.setItem('id', user.id);
    localStorage.setItem('nombreUsuario', user.nombreUsuario);
    localStorage.setItem('nombres', user.nombres);
    localStorage.setItem('token_id', user.token.id);
    localStorage.setItem('token_expiration', user.token.expiration);
  }
}