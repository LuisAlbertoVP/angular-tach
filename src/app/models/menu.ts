export type Seccion = "Categorías" | "Compras" | "Cuenta" | "Marcas" | "Proveedores" | "Reportes" | "Repuestos"
  | "Roles" | "Sistema" | "Usuarios" | "Ventas";

export interface Modulo {
  id: number;
  descripcion?: Seccion;
  ruta?: string;
  imagen?: string;
  checked?: boolean;
}

export const listModulos: Modulo[] = [
  { id: 1, descripcion: "Categorías", ruta: '/principal/categorias', imagen: 'categoria.png' },
  { id: 2, descripcion: "Compras", ruta: '/principal/compras', imagen: 'compra.png' },
  { id: 0, descripcion: "Cuenta", ruta: '/principal/cuenta', imagen: 'cuenta.png' },
  { id: 3, descripcion: "Marcas", ruta: '/principal/marcas', imagen: 'marca.png' },
  { id: 4, descripcion: "Proveedores", ruta: '/principal/proveedores', imagen: 'proveedor.png' },
  { id: 5, descripcion: "Reportes", ruta: '/principal/reporte', imagen: 'reporte.png' },
  { id: 6, descripcion: "Repuestos", ruta: '/principal/repuestos', imagen: 'repuesto.png' },
  { id: 7, descripcion: "Roles", ruta: '/principal/roles', imagen: 'rol.png' },
  { id: 0, descripcion: "Sistema", ruta: '/principal/sistema', imagen: 'sistema.png' },
  { id: 8, descripcion: "Usuarios", ruta: '/principal/usuarios', imagen: 'usuario.png' },
  { id: 9, descripcion: "Ventas", ruta: '/principal/ventas', imagen: 'venta.png' }
];