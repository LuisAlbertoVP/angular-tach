import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlCategoria } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Categoria, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CategoriaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlCategoria}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Categoria>>('getAll')));

  insertOrUpdate = (categoria: Categoria) => this.http.post(urlCategoria, categoria, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', categoria)));

  setStatus = (categoria: Categoria) => this.http.post(`${urlCategoria}/${categoria.id}/status`, categoria, httpOptions)
      .pipe(catchError(this.handleError('setStatus', categoria)));

  delete = (categoria: Categoria) => this.http.post(`${urlCategoria}/${categoria.id}/delete`, categoria, httpOptions)
      .pipe(catchError(this.handleError('delete', categoria)));
}