import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";

export interface Filtro {
  id: string;
  nombre?: string;
  criterio1?: string;
  criterio2?: string;
  criterios?: string[];
  data?: string[];
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
  estado: boolean;
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
  ], estado: true, operadorLogico: '&&'
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
  ], estado: true, operadorLogico: '&&'
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
  ], estado: true, operadorLogico: '&&'
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
  ], estado: true, operadorLogico: '&&'
};

const busquedaTransaccion: Busqueda = {
  filtros: [
    { id: "Fecha", nombre: "Fecha", esFecha: true },
    { id: "Cantidad", nombre: "Cantidad" },
    { id: "Total", nombre: "Total" },
    { id: "Direccion", nombre: "Dirección" },
    { id: "Descripcion", nombre: "Descripción" },
    { id: "FechaIngreso", nombre: "Ingreso", esFecha: true },
    { id: "FechaModificacion", nombre: "Modificación", esFecha: true }
  ], estado: true, operadorLogico: '&&'
};

export class BusquedaBuilder {
  paginator: MatPaginator = null;
  sort: MatSort =  null;

  constructor(
    criterio: Observable<unknown>, 
    paginator: MatPaginator, 
    sort: MatSort
  ) {
    criterio.subscribe(() => this.paginator.pageIndex = 0);
    sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator = paginator;
    this.sort = sort;
  }

  newBusqueda(currentBusqueda: Busqueda, orden: string = 'FechaModificacion') {
    let busqueda: Busqueda = { 
      filtros: [], estado: currentBusqueda.estado, operadorLogico: currentBusqueda.operadorLogico 
    };
    const activo = this.sort.active ? this.sort.active : orden;
    const direccion = this.sort.direction ? this.sort.direction : 'desc';
    busqueda.orden = { activo: activo, direccion: direccion };
    busqueda.pagina = this.paginator.pageIndex;
    busqueda.cantidad = this.paginator.pageSize;
    if(busqueda.operadorLogico == '&&') {
      busqueda.filtros.push({ id: "Id", criterios: [''], operador: 'contiene' });
    }
    for(let filtro of currentBusqueda.filtros) {
      if(filtro.checked) {
        if(filtro.operador == 'between') {
          busqueda.filtros.push(filtro);
        } else {
          if(filtro.criterios.length > 0) {
            busqueda.filtros.push(filtro);
          }
        }
      }
    }
    return busqueda;
  }

  static BuildBase = (): Busqueda => JSON.parse(JSON.stringify(busquedaBase));
  static BuildUsuario = (): Busqueda => JSON.parse(JSON.stringify(busquedaUsuario));
  static BuildRepuesto = (): Busqueda => JSON.parse(JSON.stringify(busquedaRepuesto));
  static BuildProveedor = (): Busqueda => JSON.parse(JSON.stringify(busquedaProveedor));
  static BuildTransaccion = (): Busqueda => JSON.parse(JSON.stringify(busquedaTransaccion));
}