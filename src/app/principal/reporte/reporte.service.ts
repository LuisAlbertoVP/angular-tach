import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { server } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reporte } from '@models/form';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly url: string = server.host + '/reportes';
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('ReporteService');
  }

  get = (): Observable<Reporte> => this.http.get<Reporte>(this.url)
      .pipe(catchError(this.handleError<Reporte>('get')));
}