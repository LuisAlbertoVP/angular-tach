export interface AddEvent {
  (url: string): void;
}

export interface PrintEvent {
  (url: string): void;
}

export interface MenuBar {
  title: string;
  addEvent?: AddEvent;
  printEvent?: PrintEvent;
}

export interface MenuItem {
  nombre: string;
  url?: string;
}

export const menuBase: MenuItem[] = [
  { nombre: 'Nueva Compra', url: '/principal/compra' },
  { nombre: 'Nueva Categoría', url: '/principal/categorias' },
  { nombre: 'Nueva Marca', url: '/principal/marcas' },
  { nombre: 'Nuevo Proveedor', url: '/principal/proveedores' },
  { nombre: 'Nuevo Repuesto', url: '/principal/repuestos' },
  { nombre: 'Nuevo Rol', url: '/principal/roles' },
  { nombre: 'Nuevo Usuario', url: '/principal/usuarios' },
  { nombre: 'Nueva Venta', url: '/principal/venta' }
];