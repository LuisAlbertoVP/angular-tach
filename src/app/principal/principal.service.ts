import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@models/auth';
import { HttpErrorHandlerService, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  readonly url: string = 'http://localhost:8080/api/cuenta';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('PrincipalService');
  }

  getById = (id: string): Observable<User> => this.http.get<User>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError<User>('getById')));

  update = (user: User) => this.http.post(`${this.url}/update`, user, httpOptions)
      .pipe(catchError(this.handleError('update', user)));
}