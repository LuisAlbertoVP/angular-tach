import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Categoria, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  readonly url: string = 'http://192.168.1.126:8080/api/categorias';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CategoriaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Categoria>>('getAll')));

  insertOrUpdate = (categoria: Categoria) => this.http.post(this.url, categoria, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', categoria)));

  setStatus = (categoria: Categoria) => this.http.post(`${this.url}/${categoria.id}/status`, categoria, httpOptions)
      .pipe(catchError(this.handleError('setStatus', categoria)));

  delete = (categoria: Categoria) => this.http.post(`${this.url}/${categoria.id}/delete`, categoria, httpOptions)
      .pipe(catchError(this.handleError('delete', categoria)));
}