export interface Base {
  id: string;
  descripcion: string;
  estado?: boolean;
  usrIngreso?: string;
  fecIngreso?: string;
  usrModificacion?: string;
  fecModificacion?: string;
}

export interface Proveedor extends Base {
  convenio: boolean;
  telefono: string;
  direccion: string;
  tipoProveedor: string;
  contacto: string;
  telefonoContacto: string;
  correoContacto: string;
}

export interface Proveedores {
  proveedores: Proveedor[];
  total: number;
}

export interface Marcas {
  marcas: Base[];
  total: number;
}

export interface Categorias {
  categorias: Base[];
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

export interface RepuestoForm {
  marcas: Base[];
  categorias: Base[];
}

export interface Repuestos {
  repuestos: Repuesto[];
  total: number;
}

export interface Venta {
  id: string;
  repuestos: Repuesto[];
}