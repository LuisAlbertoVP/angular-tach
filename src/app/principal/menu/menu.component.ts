import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { MenuBar } from '@models/menu-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMobile: boolean = false;
  menuBar: MenuBar = null;
  visible: boolean = false;

  constructor(
    private router: Router,
    private service: AuthService,
    private sharedService: SharedService
  ) {
    sharedService.menuBar$.subscribe(menuBar => this.menuBar = menuBar);
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  logout() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.service.logout();
    this.navigate('/');
  }
  
  navigate = (url: string) => this.router.navigate([url]);

  principal() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.navigate('/principal');
  }

  search(valor: string) {
    if(valor?.trim()) {
      this.navigate('/principal/repuestos/' + valor.trim());
    }
  }
}