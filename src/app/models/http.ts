import { HttpHeaders } from '@angular/common/http';

export interface Response {
  result: string;
}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':  'application/json' }),
  observe: 'response' as const
};

export const url: string = 'http://192.168.1.126:8080/api';

export const urlCategoria = url + '/categorias';
export const urlCompra = url + '/compras';
export const urlCliente = url + '/clientes';
export const urlCuenta = url + '/cuenta';
export const urlMarca = url + '/marcas';
export const urlProveedor = url + '/proveedores';
export const urlReporte = url + '/reportes';
export const urlRepuesto = url + '/repuestos';
export const urlRol = url + '/roles';
export const urlUsuario = url + '/usuarios';
export const urlVenta = url + '/ventas';