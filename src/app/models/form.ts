import { Categoria, Cliente, Compra, Marca, Rol, Venta } from "./entity";

export interface UserForm {
  roles: Rol[];
}

export interface RepuestoForm {
  marcas: Marca[];
  categorias: Categoria[];
}

export interface CompraForm {
  compra: Compra;
}

export interface VentaForm {
  venta: Venta;
  clientes: Cliente[];
}

export interface Reporte extends RepuestoForm {
  compras: Compra[];
  ventas: Venta[];
}