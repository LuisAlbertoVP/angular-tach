import { Categoria, Compra, Marca, Rol, Venta } from "./entity";

export interface UserForm {
  roles: Rol[];
}

export interface RepuestoForm {
  marcas: Marca[];
  categorias: Categoria[];
}

export interface Reporte extends RepuestoForm {
  compras: Compra[];
  ventas: Venta[];
}