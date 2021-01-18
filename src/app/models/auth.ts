export interface Modulo {
  id: number;
  descripcion?: string;
  ruta?: string;
  imagen?: string;
  checked?: boolean;
}

export interface Base {
  id: string;
  estado?: boolean;
  usuarioIngreso?: string;
  fechaIngreso?: string;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface Rol extends Base {
  descripcion: string;
  modulos?: Modulo[];
}

export interface Roles {
  data: Rol[];
  total: number;
}

export interface Token {
  id: string;
  expiration: string;
}

export interface User extends Base {
  nombreUsuario: string;
  nombres: string;
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

export interface Users {
  data: User[];
  total: number;
}

export interface UserForm {
  roles: Rol[];
}