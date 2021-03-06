import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpOptions, Mensaje, server } from '@models/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Compra, Table } from '@models/entity';
import { CompraForm } from '@models/form';
import { Busqueda } from '@models/busqueda';
import { HttpErrorHandlerService, HandleError } from '../../http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private readonly url: string = server.host + '/compras';
  private handleError: HandleError = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('CompraService');
  }

  deleteFile = (id: string) => this.http.post<Mensaje>(`${this.url}/${id}/delete_file`, {}, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('deleteFile')));

  downloadFile = (id: string): Observable<Blob> => this.http.get(`${this.url}/${id}/download_file`, { responseType: 'blob' })
      .pipe(catchError(this.handleError<Blob>('downloadFile')));

  getCompra = (id: string): Observable<CompraForm> => this.http.get<CompraForm>(`${this.url}/${id}`)
      .pipe(catchError(this.handleError<CompraForm>('get')));

  getAll = (busqueda: Busqueda) => this.http.post<Table<Compra>>(`${this.url}/all`, busqueda, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Table<Compra>>>('getAll')));

  insertOrUpdate(formData: FormData, compra: Compra) {
    let requests: Observable<HttpResponse<Object>>[] = [];
    requests.push(this.http.post(this.url, compra, httpOptions).pipe(
        catchError(this.handleError<HttpResponse<Object>>('insertOrUpdate'))));
    if(formData.has('file')) {
      requests.push(this.http.post(`${this.url}/${compra.id}/upload_file`, formData, { observe: 'response' }).pipe(
          catchError(this.handleError<HttpResponse<Object>>('uploadFile'))));
    }
    return forkJoin(requests);
  }

  setStatus = (compra: Compra) => this.http.post<Mensaje>(`${this.url}/${compra.id}/status`, compra, httpOptions)
      .pipe(catchError(this.handleError<HttpResponse<Mensaje>>('setStatus')));
}