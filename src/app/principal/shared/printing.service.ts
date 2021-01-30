import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintingService {
  private url: string = '';

  constructor(private router: Router) {}

  dataOnLoad() {
    setTimeout(() => {
      window.print();
      this.router.navigate([this.url]);
    });
  }

  printWindow(url: string, printObject?: any) {
    this.url = url.split('?')[0];
    const extras: NavigationExtras = {
      queryParams: { printObject: JSON.stringify(printObject) }, skipLocationChange: true
    };
    this.router.navigate([`${this.url}/print`], extras);
  }
}