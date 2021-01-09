import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Base, Categorias } from '@models/tach';
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
  readonly url: string = 'http://localhost:8080/api/categorias';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('CategoriaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Categorias>('getAll')));

  insertOrUpdate = (categoria: Base) => this.http.post(this.url, categoria, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', categoria)));

  setStatus = (categoria: Base) => this.http.post(`${this.url}/${categoria.id}/status`, categoria, httpOptions)
      .pipe(catchError(this.handleError('setStatus', categoria)));

  delete = (categoria: Base) => this.http.post(`${this.url}/${categoria.id}/delete`, categoria, httpOptions)
      .pipe(catchError(this.handleError('delete', categoria)));
}