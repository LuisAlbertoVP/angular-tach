import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Marca, Table } from '@models/entity';
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
  readonly url: string = 'http://192.168.1.126:8080/api/marcas';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('MarcaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Marca>>('getAll')));

  insertOrUpdate = (marca: Marca) => this.http.post(this.url, marca, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', marca)));

  setStatus = (marca: Marca) => this.http.post(`${this.url}/${marca.id}/status`, marca, httpOptions)
      .pipe(catchError(this.handleError('setStatus', marca)));

  delete = (marca: Marca) => this.http.post(`${this.url}/${marca.id}/delete`, marca, httpOptions)
      .pipe(catchError(this.handleError('delete', marca)));
}