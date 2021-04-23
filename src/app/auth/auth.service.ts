import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, url, Mensaje } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService, HandleError } from '../http-error-handler.service';
import { User } from '@models/entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  addAccount = (user: User) => this.http.post<Mensaje>(`${url}/cuenta`, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('addAccount')));

  getRolUser = (id: string): Observable<User> => this.http.get<User>(`${url}/cuenta/${id}/roles`)
      .pipe(catchError(this.handleError<User>('getRolUser')));

  login = (user: User) => this.http.post<User>(`${url}/login`, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<User>>('login')));

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