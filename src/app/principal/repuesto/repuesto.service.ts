import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, urlRepuesto } from '@models/http';
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
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('RepuestoService');
  }

  getReporte = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${urlRepuesto}/${id}/reporte`)
      .pipe(catchError(this.handleError<Repuesto>('getReporte')));

  getRepuesto = (id: string): Observable<Repuesto> => this.http.get<Repuesto>(`${urlRepuesto}/${id}`)
      .pipe(catchError(this.handleError<Repuesto>('getRepuesto')));

  getForm = (): Observable<RepuestoForm> => this.http.get<RepuestoForm>(`${urlRepuesto}/form`)
      .pipe(catchError(this.handleError<RepuestoForm>('getForm')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Repuesto>>(`${urlRepuesto}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Repuesto>>>('getAll')));

  insertOrUpdate = (repuesto: Repuesto) => this.http.post<Mensaje>(urlRepuesto, repuesto, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (repuesto: Repuesto) => this.http.post<Mensaje>(`${urlRepuesto}/${repuesto.id}/status`, repuesto, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (repuesto: Repuesto) => this.http.post<Mensaje>(`${urlRepuesto}/${repuesto.id}/delete`, repuesto, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}