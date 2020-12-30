export interface Orden {
  activo: string;
  direccion: string;
}

export interface Filtro {
  columna: string;
  criterio1: string;
  criterio2?: string;
  condicion: string;
  isRelation?: boolean;
}

export interface Busqueda {
  filtros: Filtro[];
  estado: string;
  orden?: Orden;
  pagina?: number;
  cantidad?: number;
}