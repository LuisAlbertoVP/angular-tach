import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  constructor(
    private router: Router
  ) { }

  printWindow(url: string, printObject?: any) {
    const extras: NavigationExtras = {
      queryParams: { printObject: JSON.stringify(printObject) }, skipLocationChange: true
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