export interface Filtro {
  id: string;
  nombre: string;
  criterios?: string[];
  criterio1?: string;
  criterio2?: string;
  condicion?: string;
  isRelation?: boolean;
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
}

export const busquedaBase: Busqueda = {
  filtros: [
    { id: "descripcion", nombre: "Descripción", criterio1: '', condicion: 'like', checked: true },
    { id: "fec_ing", nombre: "Fecha de ingreso", esFecha: true },
    { id: "fec_mod", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2'
};

export const busquedaUsuarios: Busqueda = {
  filtros: [
    { id: "nombres", nombre: "Nombres", criterio1: '', condicion: 'like', checked: true },
    { id: "nombre_usuario", nombre: "Nombre de usuario" },
    { id: "telefono", nombre: "Teléfono" },    
    { id: "celular", nombre: "Celular" },
    { id: "correo", nombre: "Correo" },
    { id: "cedula", nombre: "Cedula" },
    { id: "direccion", nombre: "Dirección" },
    { id: "fecha_nacimiento", nombre: "Fecha de nacimiento", esFecha: true },
    { id: "fecha_contratacion", nombre: "Fecha de contratación", esFecha: true },
    { id: "salario", nombre: "Salario" },
    { id: "fec_ing", nombre: "Fecha de ingreso", esFecha: true },
    { id: "fec_mod", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2'
};

export const busquedaRepuesto: Busqueda = {
  filtros: [
    { id: "codigo", nombre: "Código", criterio1: '', condicion: 'like', checked: true },
    { id: "marca", nombre: "Marca" },
    { id: "categoria", nombre: "Categoría" },    
    { id: "modelo", nombre: "Modelo" },
    { id: "fecha", nombre: "Año" },
    { id: "stock", nombre: "Cantidad" },
    { id: "precio", nombre: "Precio" },
    { id: "descripcion", nombre: "Descripción" },
    { id: "fec_ing", nombre: "Fecha de ingreso", esFecha: true },
    { id: "fec_mod", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2'
};

export const busquedaProveedores: Busqueda = {
  filtros: [
    { id: "descripcion", nombre: "Descripción", criterio1: '', condicion: 'like', checked: true },
    { id: "convenio", nombre: "Convenio" },
    { id: "telefono", nombre: "Teléfono" },
    { id: "direccion", nombre: "Dirección" },
    { id: "tipoProveedor", nombre: "Tipo de proveedor" },
    { id: "contacto", nombre: "Contacto" },
    { id: "telefonoContacto", nombre: "Teléfono de contacto" },
    { id: "correoContacto", nombre: "Correo de contacto" },
    { id: "fec_ing", nombre: "Fecha de ingreso", esFecha: true },
    { id: "fec_mod", nombre: "Fecha de modificación", esFecha: true }
  ], estado: '2'
};