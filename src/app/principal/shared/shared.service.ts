import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Busqueda, Filtro } from '@models/busqueda';
import { MenuBar } from '@models/menu';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private menuBar = new BehaviorSubject<MenuBar>({ title: 'Principal' });
  menuBar$ = this.menuBar.asObservable();
  private isMobile = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobile.asObservable();

  constructor(
    breakpointObserver: BreakpointObserver,
    private fb: FormBuilder
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

  private getFiltros(filtros: Filtro[]) {
    let newFiltros = [];
    for(let filtro of filtros) {
      newFiltros.push(this.fb.group({
        id: [filtro.id],
        nombre: [filtro.nombre],
        criterios: this.fb.array(filtro?.criterios ? filtro.criterios : []),
        criterio1: [filtro?.criterio1 ? filtro.criterio1 : ''], 
        criterio2: [filtro?.criterio2 ? filtro.criterio2 : ''], 
        operador: [filtro?.operador ? filtro.operador : filtro?.esFecha ? 'between' : 'like'],
        esFecha: [filtro?.esFecha],
        checked: [filtro?.checked]
      }));
    }
    return newFiltros;
  }

  public getForm(busqueda: Busqueda) {
    return this.fb.group({
      filtros: this.fb.array(this.getFiltros(busqueda.filtros)),
      estado: busqueda.estado,
      operadorLogico: '&&'
    });
  }
}