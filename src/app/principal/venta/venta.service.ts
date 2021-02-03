import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlVenta } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repuesto, Venta } from '@models/entity';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('VentaService');
  }

  getRepuesto = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${urlVenta}/repuestos/${id}`)
      .pipe(catchError(this.handleError<Repuesto>('getRepuesto')));

  insertOrUpdate = (venta: Venta) => this.http.post(urlVenta, venta, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', venta)));
}