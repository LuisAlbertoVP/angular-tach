export interface Base {
  id: string;
  descripcion: string;
  estado?: boolean;
  usuarioIngreso?: string;
  fechaIngreso?: string;
  stock?: number;
  usuarioModificacion?: string;
  fechaModificacion?: string;
}

export interface Bases {
  data: Base[];
  total: number;
}

export interface Proveedor extends Base {
  convenio: boolean;
  telefono?: string;
  direccion?: string;
  tipoProveedor?: string;
  contacto?: string;
  telefonoContacto?: string;
  correoContacto?: string;
}

export interface Proveedores {
  data: Proveedor[];
  total: number;
}

export interface Repuesto extends Base {
  codigo: string;
  marca?: Base;
  categoria?: Base;
  modelo?: string;
  fecha: string;
  stock: number;
  precio: number;
}

export interface Repuestos {
  data: Repuesto[];
  total: number;
}

export interface RepuestoForm {
  marcas: Base[];
  categorias: Base[];
}

export interface Venta {
  id: string;
  repuestos: Repuesto[];
}