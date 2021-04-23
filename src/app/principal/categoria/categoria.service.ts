import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, urlCategoria } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Categoria, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CategoriaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post<Table<Categoria>>(`${urlCategoria}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Categoria>>>('getAll')));

  insertOrUpdate = (categoria: Categoria) => this.http.post<Mensaje>(urlCategoria, categoria, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('insertOrUpdate')));

  setStatus = (categoria: Categoria) => this.http.post<Mensaje>(`${urlCategoria}/${categoria.id}/status`, categoria, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));

  delete = (categoria: Categoria) => this.http.post<Mensaje>(`${urlCategoria}/${categoria.id}/delete`, categoria, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('delete')));
}