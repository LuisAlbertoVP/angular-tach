export interface Filtro {
  id: string;
  nombre?: string;
  criterio1?: string;
  criterio2?: string;
  criterios?: string[];
  operador?: string;
  esFecha?: boolean;
  checked?: boolean;
}

export interface Orden {
  activo: string;
  direccion: string;
}

export interface Busqueda {
  filtros: Filtro[];
  estado: string;
  orden?: Orden;
  pagina?: number;
  cantidad?: number;
  operadorLogico: string;
  tiempo?: number;
}

const busquedaBase: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción" },
    { id: "FechaIngreso", nombre: "Ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Modificación", esFecha: true }
  ], estado: '1', operadorLogico: '&&'
};

const busquedaUsuario: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres" },
    { id: "NombreUsuario", nombre: "Usuario" },
    { id: "Telefono", nombre: "Teléfono" },    
    { id: "Celular", nombre: "Celular" },
    { id: "Correo", nombre: "Correo" },
    { id: "Cedula", nombre: "Cedula" },
    { id: "Direccion", nombre: "Dirección" },
    { id: "FechaNacimiento", nombre: "Nacimiento", esFecha: true },
    { id: "FechaContratacion", nombre: "Contratación", esFecha: true },
    { id: "Salario", nombre: "Salario" },
    { id: "FechaIngreso", nombre: "Ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Modificación", esFecha: true }
  ], estado: '1', operadorLogico: '&&'
};

const busquedaRepuesto: Busqueda = {
  filtros: [
    { id: "Codigo", nombre: "Código" },
    { id: "Marca.Descripcion", nombre: "Marca" },
    { id: "Categoria.Descripcion", nombre: "Categoría" },    
    { id: "Modelo", nombre: "Modelo" },
    { id: "Epoca", nombre: "Año" },
    { id: "SubMarca", nombre: "SubMarca" },
    { id: "Stock", nombre: "Cantidad" },
    { id: "Precio", nombre: "Precio" },
    { id: "Descripcion", nombre: "Descripción" },
    { id: "FechaIngreso", nombre: "Ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Modificación", esFecha: true }
  ], estado: '1', operadorLogico: '&&'
};

const busquedaProveedor: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción" },
    { id: "Convenio", nombre: "Convenio" },
    { id: "Telefono", nombre: "Teléfono" },
    { id: "Direccion", nombre: "Dirección" },
    { id: "TipoProveedor", nombre: "Tipo" },
    { id: "Contacto", nombre: "Contacto" },
    { id: "TelefonoContacto", nombre: "Teléfono" },
    { id: "CorreoContacto", nombre: "Correo" },
    { id: "FechaIngreso", nombre: "Ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Modificación", esFecha: true }
  ], estado: '1', operadorLogico: '&&'
};

export class BusquedaBuilder {
  static BuildBase = (): Busqueda => JSON.parse(JSON.stringify(busquedaBase));
  static BuildUsuario = (): Busqueda => JSON.parse(JSON.stringify(busquedaUsuario));
  static BuildRepuesto = (): Busqueda => JSON.parse(JSON.stringify(busquedaRepuesto));
  static BuildProveedor = (): Busqueda => JSON.parse(JSON.stringify(busquedaProveedor));
}