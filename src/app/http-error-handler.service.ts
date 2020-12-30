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
    return (error: HttpErrorResponse): Observable<T> => {
      const message = (error.error instanceof ErrorEvent) ?
        error.error.message : `codigo ${error.status} y cuerpo: ${JSON.stringify(error.error)}`;

      console.error(`${serviceName}: ${operation} fallo con: ${message}`);

      this.snackBar.open(JSON.stringify(error.error), 'Error', {duration: 3000});

      return of(result);
    };
  }
}