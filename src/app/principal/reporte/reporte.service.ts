import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reporte } from '@models/reporte';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  readonly url: string = 'http://192.168.1.126:8080/api/reportes';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ReporteService');
  }

  get = (): Observable<Reporte> => this.http.get<Reporte>(this.url)
      .pipe(catchError(this.handleError<Reporte>('get')));
}