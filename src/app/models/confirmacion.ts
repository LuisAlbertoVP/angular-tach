import { Seccion } from "./menu";

export type Accion = "Continuar" | "Eliminar";

export interface ConfirmationData {
  seccion: Seccion;
  accion: Accion;
}

export interface ConfirmationDialog {
  titulo: string;
  mensaje: string;
  accion: Accion;
}

export class ConfirmationDelete {
  generate(seccion: Seccion): ConfirmationDialog {
    switch(seccion) {
      case "Categorías": return this.build('esta categoría');
      case "Marcas": return this.build('esta marca');
      case "Proveedores": return this.build('este proveedor');
      case "Repuestos": return this.build('este repuesto');
      case "Roles": return this.build('este rol');
      case "Usuarios": return this.build('este usuario');
    }
  }

  private build(mensaje: string): ConfirmationDialog {
    return { 
      titulo: 'Advertencia', accion: "Eliminar",
      mensaje: `¿Está seguro de que desea eliminar definitivamente ${mensaje}?`
    };
  }
}

export class ConfirmationAccept {
  generate(seccion: Seccion): ConfirmationDialog {
    switch(seccion) {
      case "Compras": return this.build('la compra');
      case "Ventas": return this.build('la venta');
    }
  }

  private build(mensaje: string): ConfirmationDialog {
    return { 
      titulo: 'Mensaje', accion: "Continuar",
      mensaje: `¿Desea guardar ${mensaje}?`
    };
  }
}