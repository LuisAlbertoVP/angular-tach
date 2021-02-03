export interface FilterEvent {
  (url: string): void;
}

export interface PrintEvent {
  (url: string): void;
}

export interface MenuBar {
  title: string;
  filterEvent?: FilterEvent;
  printEvent?: PrintEvent;
}

export interface MenuItem {
  nombre: string;
  url?: string;
}

export const menuBase: MenuItem[] = [
  { nombre: 'Compras', url: '/principal/compras' },
  { nombre: 'Ventas', url: '/principal/ventas' },
  { nombre: 'divider' },
  { nombre: 'Categorías', url: '/principal/categorias' },
  { nombre: 'Marcas', url: '/principal/marcas' },
  { nombre: 'Proveedores', url: '/principal/proveedores' },
  { nombre: 'Repuestos', url: '/principal/repuestos' },
  { nombre: 'divider' },
  { nombre: 'Roles', url: '/principal/roles' },
  { nombre: 'Usuarios', url: '/principal/usuarios' }
];