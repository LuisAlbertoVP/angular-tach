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
}

export const busquedaBase: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción", criterio1: '', operador: 'like', checked: true },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2', operadorLogico: '&&'
};

export const busquedaUsuarios: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres", criterio1: '', operador: 'like', checked: true },
    { id: "NombreUsuario", nombre: "Nombre de usuario" },
    { id: "Telefono", nombre: "Teléfono" },    
    { id: "Celular", nombre: "Celular" },
    { id: "Correo", nombre: "Correo" },
    { id: "Cedula", nombre: "Cedula" },
    { id: "Direccion", nombre: "Dirección" },
    { id: "FechaNacimiento", nombre: "Fecha de nacimiento", esFecha: true },
    { id: "FechaContratacion", nombre: "Fecha de contratación", esFecha: true },
    { id: "Salario", nombre: "Salario" },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2', operadorLogico: '&&'
};

export const busquedaRepuesto: Busqueda = {
  filtros: [
    { id: "Codigo", nombre: "Código", criterio1: '', operador: 'like', checked: true },
    { id: "Marca.Descripcion", nombre: "Marca" },
    { id: "Categoria.Descripcion", nombre: "Categoría" },    
    { id: "Modelo", nombre: "Modelo" },
    { id: "Epoca", nombre: "Año" },
    { id: "Stock", nombre: "Cantidad" },
    { id: "Precio", nombre: "Precio" },
    { id: "Descripcion", nombre: "Descripción" },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2', operadorLogico: '&&'
};

export const busquedaProveedores: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción", criterio1: '', operador: 'like', checked: true },
    { id: "Convenio", nombre: "Convenio" },
    { id: "Telefono", nombre: "Teléfono" },
    { id: "Direccion", nombre: "Dirección" },
    { id: "TipoProveedor", nombre: "Tipo de proveedor" },
    { id: "Contacto", nombre: "Contacto" },
    { id: "TelefonoContacto", nombre: "Teléfono de contacto" },
    { id: "CorreoContacto", nombre: "Correo de contacto" },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2', operadorLogico: '&&'
};