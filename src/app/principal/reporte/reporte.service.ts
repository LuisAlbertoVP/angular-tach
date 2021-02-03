import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlReporte } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reporte } from '@models/form';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('ReporteService');
  }

  get = (): Observable<Reporte> => this.http.get<Reporte>(urlReporte)
      .pipe(catchError(this.handleError<Reporte>('get')));
}