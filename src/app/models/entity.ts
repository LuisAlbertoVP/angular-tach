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

export interface Marca extends Entity {
  id?: string;
  descripcion?: string;
  stock?: number;
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

export interface Token {
  id?: string;
  expiration?: string;
}

export interface User extends Entity {
  id?: string;
  nombreUsuario?: string;
  nombres?: string;
  clave?: string;
  nuevaClave?: string;
  cedula?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  celular?: string;
  fechaNacimiento?: string;
  fechaContratacion?: string;
  salario?: number;
  roles?: Rol[];
  token?: Token;
}

export interface Venta extends Entity {
  id?: string;
  descripcion?: string;
  repuestos?: Repuesto[];
  cantidad?: number;
  total?: number;
}