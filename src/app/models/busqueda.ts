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
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaCliente: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },    
    { id: "Celular", nombre: "Celular", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "Cedula", nombre: "Cedula", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "TipoCliente", nombre: "Tipo", tipo: 'text' },
    { id: "FechaNacimiento", nombre: "Nacimiento", tipo: 'date' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaUsuario: Busqueda = {
  filtros: [
    { id: "Nombres", nombre: "Nombres", tipo: 'text' },
    { id: "NombreUsuario", nombre: "Usuario", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },    
    { id: "Celular", nombre: "Celular", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "Cedula", nombre: "Cedula", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "FechaNacimiento", nombre: "Nacimiento", tipo: 'date' },
    { id: "FechaContratacion", nombre: "Contratación", tipo: 'date' },
    { id: "Salario", nombre: "Salario", tipo: 'number' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaRepuesto: Busqueda = {
  filtros: [
    { id: "Codigo", nombre: "Código", tipo: 'text' },
    { id: "Marca.Descripcion", nombre: "Marca", tipo: 'text' },
    { id: "Categoria.Descripcion", nombre: "Categoría", tipo: 'text' },    
    { id: "Modelo", nombre: "Modelo", tipo: 'text' },
    { id: "Epoca", nombre: "Año", tipo: 'text' },
    { id: "SubMarca", nombre: "SubMarca", tipo: 'text' },
    { id: "Stock", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "Precio", nombre: "Precio", tipo: 'number' },
    { id: "Stock * Precio", nombre: "Total", tipo: 'number' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaProveedor: Busqueda = {
  filtros: [
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "Telefono", nombre: "Teléfono", tipo: 'text' },
    { id: "WebSite", nombre: "Sitio Web", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "Correo", nombre: "Correo", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaCompra: Busqueda = {
  filtros: [
    { id: "Fecha", nombre: "Fecha", tipo: 'date' },
    { id: "CompraDetalle.Sum(Cantidad)", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "CompraDetalle.Sum(Cantidad * Repuesto.Precio)", nombre: "Total", tipo: 'number' },
    { id: "Proveedor.Descripcion", nombre: "Proveedor", tipo: 'text' },
    { id: "Numero", nombre: "Numero", tipo: 'text' },
    { id: "Vendedor", nombre: "Vendedor", tipo: 'text' },
    { id: "SoldTo", nombre: "Vendido a", tipo: 'text' },
    { id: "ShipTo", nombre: "Enviado a", tipo: 'text' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
  ], estado: true, operadorLogico: '&&'
};

const busquedaVenta: Busqueda = {
  filtros: [
    { id: "Fecha", nombre: "Fecha", tipo: 'date' },
    { id: "VentaDetalle.Sum(Cantidad)", nombre: "Cantidad", tipo: 'number', tipoNativo: 'int' },
    { id: "VentaDetalle.Sum(Cantidad * Repuesto.Precio)", nombre: "Total", tipo: 'number' },
    { id: "Cliente.Nombres", nombre: "Cliente", tipo: 'text' },
    { id: "Direccion", nombre: "Dirección", tipo: 'text' },
    { id: "Descripcion", nombre: "Descripción", tipo: 'text' },
    { id: "FechaIngreso", nombre: "Ingreso", tipo: 'date' },
    { id: "FechaModificacion", nombre: "Modificación", tipo: 'date' }
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
      cantidad: this.paginator.pageSize, estado: currentBusqueda.estado, filtros: [], 
      operadorLogico: currentBusqueda.operadorLogico, pagina: this.paginator.pageIndex,
      orden: { 
        activo: this.sort.active ? this.sort.active : orden, 
        direccion: this.sort.direction ? this.sort.direction : 'desc' 
      }
    };
    if(busqueda.operadorLogico == '&&') {
      busqueda.filtros.push({ id: "Id", criterios: [''], operador: 'contiene' });
    }
    for(let i = 0; i < currentBusqueda.filtros.length; i++) {
      if(currentBusqueda.filtros[i].checked) {
        this._addChecked(busqueda.filtros, currentBusqueda.filtros[i]);
      }
    }
    return busqueda;
  }

  private _addChecked(filtros: Filtro[], filtro: Filtro) {
    if(filtro.operador == 'between') {
      if(filtro.tipo == 'number') {
        if(filtro.tipoNativo == 'int') {
          filtro.criterio1 = Math.trunc(+filtro.criterio1).toString();
          filtro.criterio2 = Math.trunc(+filtro.criterio2).toString();
        } else {
          filtro.criterio1 = filtro.criterio1 ? filtro.criterio1 : '0';
          filtro.criterio2 = filtro.criterio2 ? filtro.criterio2 : '0';
        }
      }
      filtros.push(filtro);
    } else {
      if(filtro.criterios.length > 0) filtros.push(filtro);
    }
  }

  static BuildBase = (): Busqueda => JSON.parse(JSON.stringify(busquedaBase));
  static BuildCliente = (): Busqueda => JSON.parse(JSON.stringify(busquedaCliente));
  static BuildUsuario = (): Busqueda => JSON.parse(JSON.stringify(busquedaUsuario));
  static BuildRepuesto = (): Busqueda => JSON.parse(JSON.stringify(busquedaRepuesto));
  static BuildProveedor = (): Busqueda => JSON.parse(JSON.stringify(busquedaProveedor));
  static BuildCompra = (): Busqueda => JSON.parse(JSON.stringify(busquedaCompra));
  static BuildVenta = (): Busqueda => JSON.parse(JSON.stringify(busquedaVenta));
}