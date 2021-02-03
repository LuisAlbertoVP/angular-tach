import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repuesto, Venta } from '@models/entity';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  readonly url: string = 'http://192.168.1.126:8080/api/ventas';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('VentaService');
  }

  getRepuesto = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${this.url}/repuestos/${id}`)
      .pipe(catchError(this.handleError<Repuesto>('getRepuesto')));

  insertOrUpdate = (venta: Venta) => this.http.post(this.url, venta, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', venta)));
}