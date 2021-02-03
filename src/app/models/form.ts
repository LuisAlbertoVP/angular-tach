import { Categoria, Marca, Rol } from "./entity";

export interface UserForm {
  roles: Rol[];
}

export interface RepuestoForm {
  marcas: Marca[];
  categorias: Categoria[];
}

export interface Reporte extends RepuestoForm {

}