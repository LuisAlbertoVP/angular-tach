import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);

  handleError<T> (serviceName = '', operation = 'operation', result = {} as T) {
    return (response: HttpErrorResponse): Observable<T> => {
      const message = (response.error instanceof ErrorEvent) ?
      response.error.message : `codigo ${response.status} y cuerpo: ${JSON.stringify(response.error)}`;
      console.error(`${serviceName}: ${operation} fallo con: ${message}`);
      if(response.error && typeof response.error == 'string') {
        this.snackBar.open(response.error, 'Error', {duration: 3000});
      }
      return of(result);
    };
  }
}