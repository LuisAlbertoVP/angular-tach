import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlCompra } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repuesto, Compra } from '@models/entity';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CompraService');
  }

  getRepuesto = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${urlCompra}/repuestos/${id}`)
      .pipe(catchError(this.handleError<Repuesto>('getRepuesto')));

  insertOrUpdate = (compra: Compra) => this.http.post(urlCompra, compra, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', compra)));
}