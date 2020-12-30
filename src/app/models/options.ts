export interface Option {
  id: string;
  nombre: string;
}

export const optionsBase: Option[] = [
  { id: "descripcion", nombre: "Descripción" },
  { id: "fec_ing", nombre: "Fecha de ingreso" },
  { id: "fec_mod", nombre: "Fecha de modificación" }
];

export const optionsUsuarios: Option[] = [
  { id: "nombres", nombre: "Nombres" },
  { id: "nombre_usuario", nombre: "Nombre de usuario" },
  { id: "telefono", nombre: "Teléfono" },    
  { id: "celular", nombre: "Celular" },
  { id: "correo", nombre: "Correo" },
  { id: "cedula", nombre: "Cedula" },
  { id: "direccion", nombre: "Dirección" },
  { id: "fecha_nacimiento", nombre: "Fecha de nacimiento" },
  { id: "fecha_contratacion", nombre: "Fecha de contratación" },
  { id: "salario", nombre: "Salario" },
  { id: "fec_ing", nombre: "Fecha de ingreso" },
  { id: "fec_mod", nombre: "Fecha de modificación" }
];

export const optionsRepuestos: Option[] = [
  { id: "codigo", nombre: "Código" },
  { id: "marca", nombre: "Marca" },
  { id: "categoria", nombre: "Categoría" },    
  { id: "modelo", nombre: "Modelo" },
  { id: "fecha", nombre: "Año" },
  { id: "stock", nombre: "Cantidad" },
  { id: "precio", nombre: "Precio" },
  { id: "descripcion", nombre: "Descripción" },
  { id: "fec_ing", nombre: "Fecha de ingreso" },
  { id: "fec_mod", nombre: "Fecha de modificación" }
];

export const optionsProveedores: Option[] = [
  { id: "descripcion", nombre: "Descripción" },
  { id: "convenio", nombre: "Convenio" },
  { id: "telefono", nombre: "Teléfono" },
  { id: "direccion", nombre: "Dirección" },
  { id: "tipoProveedor", nombre: "Tipo de proveedor" },
  { id: "contacto", nombre: "Contacto" },
  { id: "telefonoContacto", nombre: "Teléfono de contacto" },
  { id: "correoContacto", nombre: "Correo de contacto" },
  { id: "fec_ing", nombre: "Fecha de ingreso" },
  { id: "fec_mod", nombre: "Fecha de modificación" }
];