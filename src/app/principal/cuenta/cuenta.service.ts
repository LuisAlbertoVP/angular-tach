import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, server } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '@models/entity';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly url: string = server.host + '/cuenta';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('CuentaService');
  }

  getById = (id: string): Observable<User> => this.http.get<User>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError<User>('getById')));

  update = (user: User) => this.http.post<Mensaje>(`${this.url}/update`, user, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('update')));
}