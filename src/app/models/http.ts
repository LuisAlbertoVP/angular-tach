import { HttpHeaders } from '@angular/common/http';

export interface Mensaje {
  texto: string;
}

export interface Server {
  host: string;
}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  observe: 'response' as const
};

export const server: Server = { host: 'http://localhost:8080/api' };