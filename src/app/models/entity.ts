import { Modulo } from "./menu";

export interface Table<T> {
  data: T[];
  total: number;
}

export interface Entity {
  estado?: boolean;
  usuarioIngreso?: string;
  fechaIngreso?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface Categoria extends Entity {
  id?: string;
  descripcion?: string;
  stock?: number;
}

export interface Cliente extends Person {
  tipoCliente?: TipoCliente;
}

export interface Compra extends Transaccion {
  proveedor?: Proveedor;
}

export interface Marca extends Entity {
  id?: string;
  descripcion?: string;
  stock?: number;
}

export interface Person extends Entity {
  id?: string;
  nombres?: string;
  cedula?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  celular?: string;
  fechaNacimiento?: string;
}

export interface Proveedor extends Entity {
  id?: string;
  descripcion?: string;
  convenio?: boolean;
  telefono?: string;
  direccion?: string;
  tipoProveedor?: string;
  contacto?: string;
  telefonoContacto?: string;
  correoContacto?: string;
}

export interface Repuesto extends Entity {
  id?: string;
  descripcion?: string;
  codigo?: string;
  marca?: Marca;
  categoria?: Categoria;
  modelo?: string;
  stock?: number;
  precio?: number;
  epoca?: string;
  subMarca?: string;
}

export interface Rol extends Entity {
  id?: string;
  descripcion?: string;
  modulos?: Modulo[];
}

export enum TipoCliente {
  Cliente = 'Cliente',
  SujetoRetenido = 'Sujeto Retenido',
  Destinatario = 'Destinatario'
}

export interface Token {
  id?: string;
  expiration?: string;
}

export interface Transaccion extends Entity {
  id?: string;
  repuestos?: Repuesto[];
  cantidad?: number;
  total?: number;
  descripcion?: string;
}

export interface User extends Person {
  nombreUsuario?: string;
  clave?: string;
  fechaContratacion?: string;
  salario?: number;
  roles?: Rol[];
  token?: Token;
}

export interface Venta extends Transaccion {
  cliente?: Cliente;
}