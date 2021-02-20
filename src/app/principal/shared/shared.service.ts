import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuBar } from '@models/menu-bar';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

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
  
  buildMenuBar = (menuBar: MenuBar) => this.menuBar.next(menuBar);

  showErrorMessage = (message: string) => this.snackBar.open(message, 'Error', {duration: 2000});

  showMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['success']});

  showWarningMessage = (message: string) => this.snackBar.open(message, 'Ok', {duration: 2000, panelClass: ['warning']});

  parseArray = (array: any[]) => array.map(element => element.descripcion).join(', ');

  parseDate = (fecha: string) => moment(fecha).format('DD/MM/YYYY');

  parseDateTime = (fecha: string) => moment(fecha).format('DD/MM/YYYY, hh:mm:ss A');
}