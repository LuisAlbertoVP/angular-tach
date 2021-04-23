import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, urlMarca } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Marca, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('MarcaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Marca>>(`${urlMarca}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Marca>>>('getAll')));

  insertOrUpdate = (marca: Marca) => this.http.post<Mensaje>(urlMarca, marca, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (marca: Marca) => this.http.post<Mensaje>(`${urlMarca}/${marca.id}/status`, marca, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (marca: Marca) => this.http.post<Mensaje>(`${urlMarca}/${marca.id}/delete`, marca, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}