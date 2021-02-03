import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repuesto, Table } from '@models/entity';
import { RepuestoForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {
  readonly url: string = 'http://192.168.1.126:8080/api/repuestos';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RepuestoService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Repuesto>>('getAll')));

  getForm = (): Observable<RepuestoForm> => this.http.get<RepuestoForm>(`${this.url}/form`)
      .pipe(catchError(this.handleError<RepuestoForm>('getForm')));

  insertOrUpdate = (repuesto: Repuesto) => this.http.post(this.url, repuesto, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', repuesto)));

  setStatus = (repuesto: Repuesto) => this.http.post(`${this.url}/${repuesto.id}/status`, repuesto, httpOptions)
      .pipe(catchError(this.handleError('setStatus', repuesto)));

  delete = (repuesto: Repuesto) => this.http.post(`${this.url}/${repuesto.id}/delete`, repuesto, httpOptions)
      .pipe(catchError(this.handleError('delete', repuesto)));
}