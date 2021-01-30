import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Busqueda, Filtro } from '@models/busqueda';
import { MenuBar } from '@models/menu';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isMobile = new BehaviorSubject<boolean>(false);
  private menuBar = new BehaviorSubject<MenuBar>({ title: 'Principal' });
  isMobile$ = this.isMobile.asObservable();
  menuBar$ = this.menuBar.asObservable();

  constructor(
    breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { 
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile.next(true);
      } else {
        this.isMobile.next(false);
      }
    });
  }
  

  buildMenuBar(menuBar: MenuBar) {
    this.menuBar.next(menuBar);
  }

  getBusquedaForm(busqueda: Busqueda) {
    return this.fb.group({
      filtros: this.fb.array(this.getFiltros(busqueda.filtros)),
      estado: busqueda.estado,
      operadorLogico: '&&'
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});
  }

  private getFiltros(filtros: Filtro[]) {
    let newFiltros = [];
    for(let filtro of filtros) {
      newFiltros.push(this.fb.group({
        id: [filtro.id],
        nombre: [filtro.nombre],
        criterios: this.fb.array(filtro?.criterios ? filtro.criterios : []),
        criterio1: [filtro?.criterio1 ? filtro.criterio1 : ''], 
        criterio2: [filtro?.criterio2 ? filtro.criterio2 : ''], 
        operador: [filtro?.operador ? filtro.operador : filtro?.esFecha ? 'between' : 'contiene'],
        esFecha: [filtro?.esFecha],
        checked: [filtro?.checked]
      }));
    }
    return newFiltros;
  }
}