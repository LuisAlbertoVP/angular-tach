import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlRepuesto } from '@models/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repuesto, Table } from '@models/entity';
import { RepuestoForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RepuestoService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlRepuesto}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Repuesto>>('getAll')));

  getForm = (): Observable<RepuestoForm> => this.http.get<RepuestoForm>(`${urlRepuesto}/form`)
      .pipe(catchError(this.handleError<RepuestoForm>('getForm')));

  getRepuesto = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${urlRepuesto}/${id}`)
      .pipe(catchError(this.handleError<Repuesto>('getRepuesto')));

  insertOrUpdate = (repuesto: Repuesto) => this.http.post(urlRepuesto, repuesto, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', repuesto)));

  setStatus = (repuesto: Repuesto) => this.http.post(`${urlRepuesto}/${repuesto.id}/status`, repuesto, httpOptions)
      .pipe(catchError(this.handleError('setStatus', repuesto)));

  delete = (repuesto: Repuesto) => this.http.post(`${urlRepuesto}/${repuesto.id}/delete`, repuesto, httpOptions)
      .pipe(catchError(this.handleError('delete', repuesto)));
}