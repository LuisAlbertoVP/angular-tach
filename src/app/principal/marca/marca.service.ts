import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Base, Marcas } from '@models/tach';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as const
};

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  url: string = 'http://localhost:8080/api/marcas';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('MarcaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Marcas>('getAll')));

  insertOrUpdate = (marca: Base) => this.http.post(this.url, marca, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', marca)));

  setStatus = (marca: Base) => this.http.post(`${this.url}/${marca.id}`, marca, httpOptions)
      .pipe(catchError(this.handleError('setStatus', marca)));

  delete = (id: string) => this.http.delete(`${this.url}/${id}`, httpOptions)
      .pipe(catchError(this.handleError('delete', id)));
}