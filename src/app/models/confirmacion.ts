export type Accion = "Continuar" | "Eliminar";

export interface ConfirmationDialog {
  titulo?: string;
  mensaje: string;
  accion: Accion;
}