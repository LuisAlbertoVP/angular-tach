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
  tipo?: string;
  tipoNativo?: string;
}

export interface Orden {
  activo: string;
  direccion: string;
}

export interface Busqueda {
  filtros?: Filtro[];
  estado?: boolean;
  orden?: Orden;
  pagina?: number;
  cantidad?: number;
  operadorLogico?: string;
  tiempo?: number;
}

export interface BusquedaBuilder {
  rootBusqueda: Busqueda;
  nextBusqueda?: Busqueda;
}

export const busquedaBase: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaCliente: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },    
    { id: "Celular", nombre: "Celular", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "Cedula", nombre: "Cedula", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "TipoCliente", nombre: "Tipo de cliente", tipo: 'text' },
    { id: "FechaNacimiento", nombre: "Fecha de nacimiento", tipo: 'date' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaUsuario: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres", tipo: 'text' },
    { id: "NombreUsuario", nombre: "Usuario", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },    
    { id: "Celular", nombre: "Celular", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "Cedula", nombre: "Cedula", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "Salario", nombre: "Salario", tipo: 'number' },
    { id: "FechaNacimiento", nombre: "Fecha de nacimiento", tipo: 'date' },
    { id: "FechaContratacion", nombre: "Fecha de contratación", tipo: 'date' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaRepuesto: Busqueda = {
  filtros: [
    { id: "Codigo", nombre: "Código", tipo: 'text' },
    { id: "Marca.Descripcion", nombre: "Marca", tipo: 'text' },
    { id: "Categoria.Descripcion", nombre: "Categoría", tipo: 'text' },    
    { id: "Modelo", nombre: "Modelo", tipo: 'text' },
    { id: "Epoca", nombre: "Año", tipo: 'text' },
    { id: "SubMarca", nombre: "Submarca", tipo: 'text' },
    { id: "Stock", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "Precio", nombre: "Precio", tipo: 'number' },
    { id: "Stock * Precio", nombre: "Total", tipo: 'number' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaProveedor: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },
    { id: "WebSite", nombre: "Sitio Web", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaCompra: Busqueda = {
  filtros: [
    { id: "Fecha", nombre: "Fecha", tipo: 'date' },
    { id: "Proveedor.Descripcion", nombre: "Proveedor", tipo: 'text' },
    { id: "TipoDocumento", nombre: "Tipo de documento", tipo: 'text' },
    { id: "Numero", nombre: "Numero de documento", tipo: 'text' },
    { id: "CompraDetalle.Sum(Cantidad)", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "CompraDetalle.Sum(Cantidad * Precio)", nombre: "Total", tipo: 'number' },
    { id: "Vendedor", nombre: "Vendedor", tipo: 'text' },
    { id: "SoldTo", nombre: "Vendido a", tipo: 'text' },
    { id: "ShipTo", nombre: "Enviado a", tipo: 'text' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export const busquedaVenta: Busqueda = {
  filtros: [
    { id: "Fecha", nombre: "Fecha", tipo: 'date' },
    { id: "Cliente.Nombres", nombre: "Cliente", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "VentaDetalle.Sum(Cantidad)", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "VentaDetalle.Sum(Cantidad * Precio)", nombre: "Total", tipo: 'number' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Fecha de ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Fecha de modificación", tipo: 'date' }
  ]
};

export class BusquedaFactory {
  paginator: MatPaginator = null;
  sort: MatSort =  null;

  constructor(
    customEvent: Observable<unknown>, 
    paginator: MatPaginator, 
    sort: MatSort
  ) {
    this.paginator = paginator;
    this.sort = sort;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    customEvent.subscribe(() => this.paginator.pageIndex = 0);
  }

  newBusqueda(nextBusqueda: Busqueda): Busqueda {
    if(this._isFirstBusqueda(nextBusqueda)) {
      nextBusqueda = this._createFirstBusqueda();
    }
    nextBusqueda.cantidad = this.paginator.pageSize;
    nextBusqueda.pagina = this.paginator.pageIndex;
    nextBusqueda.orden = {
      activo: this.sort.active ? this.sort.active : 'FechaModificacion', 
      direccion: this.sort.direction ? this.sort.direction : 'desc' 
    };
    return nextBusqueda;
  }

  private _isFirstBusqueda(nextBusqueda: Busqueda): boolean {
    return !nextBusqueda || nextBusqueda?.filtros.length == 0; 
  }

  private _createFirstBusqueda(): Busqueda { 
    return {
      estado: true, operadorLogico: '&&', filtros: [
        { id: "Id", criterios: [''], operador: 'contiene' }
      ]
    };
  }
}