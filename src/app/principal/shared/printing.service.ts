import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Busqueda } from '@models/busqueda';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  constructor(
    private router: Router
  ) { }

  printWindow(url: string, busqueda: Busqueda) {
    const extras: NavigationExtras = {
      queryParams: { busqueda: JSON.stringify(busqueda) },
      skipLocationChange: true
    };
    this.router.navigate([url], extras)
  }

  dataOnLoad(url: string) {
    setTimeout(() => {
      window.print();
      this.router.navigate([url]);
    });
  }
}