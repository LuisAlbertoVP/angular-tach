import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
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

  constructor(breakpointObserver: BreakpointObserver) { 
    breakpointObserver.observe([
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
}