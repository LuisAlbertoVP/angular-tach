import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared_service/*';
import { menuBase, MenuBar, MenuItem } from '@models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuBar: MenuBar;
  menuItems: MenuItem[] = menuBase;
  visible: boolean = false;

  constructor(
    private router: Router,
    private service: AuthService,
    private sharedService: SharedService
  ) {
    sharedService.menuBar$.subscribe(menuBar => this.menuBar = menuBar);
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