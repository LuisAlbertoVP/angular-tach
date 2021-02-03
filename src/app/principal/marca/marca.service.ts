import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpOptions, urlMarca } from '@models/http';
import { catchError } from 'rxjs/operators';
import { Marca, Table } from '@models/entity';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) { 
    this.handleError = httpErrorHandler.createHandleError('MarcaService');
  }

  getAll = (busqueda: Busqueda) => this.http.post(`${urlMarca}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<Table<Marca>>('getAll')));

  insertOrUpdate = (marca: Marca) => this.http.post(urlMarca, marca, httpOptions)
      .pipe(catchError(this.handleError('insertOrUpdate', marca)));

  setStatus = (marca: Marca) => this.http.post(`${urlMarca}/${marca.id}/status`, marca, httpOptions)
      .pipe(catchError(this.handleError('setStatus', marca)));

  delete = (marca: Marca) => this.http.post(`${urlMarca}/${marca.id}/delete`, marca, httpOptions)
      .pipe(catchError(this.handleError('delete', marca)));
}