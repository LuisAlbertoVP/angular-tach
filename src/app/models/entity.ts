import { Modulo } from "./menu";

export interface Table<T> {
  data?: T[];
  cantidad?: number;
  stock?: number;
  precio?: number;
}

export interface Entity {
  id?: string;
  estado?: boolean;
  usuarioIngreso?: string;
  fechaIngreso?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface Categoria extends Entity {
  descripcion?: string;
  stock?: number;
  precio?: number;
  cantidadCompras?: number;
  cantidadVentas?: number;
}

export interface Cliente extends Person {
  tipoCliente?: TipoCliente;
}

export interface Compra extends Transaccion {
  proveedor?: Proveedor;
  compraDetalle?: CompraDetalle[];
}

export interface CompraDetalle {
  compraId?: string;
  repuestoId?: string;
  cantidad?: number;
  repuesto?: Repuesto;
}

export interface Marca extends Entity {
  descripcion?: string;
  stock?: number;
  precio?: number;
  cantidadCompras?: number;
  cantidadVentas?: number;
}

export interface Person extends Entity {
  nombres?: string;
  cedula?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  celular?: string;
  fechaNacimiento?: string;
}

export interface Proveedor extends Entity {
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
  fecha?: string;
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
  direccion?: string;
  ventaDetalle?: VentaDetalle[];
}

export interface VentaDetalle {
  repuestoId?: string;
  ventaId?: string;
  cantidad?: number;
  repuesto?: Repuesto;
}