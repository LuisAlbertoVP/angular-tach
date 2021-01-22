import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared_service/*';
import { menuBase, MenuBar, MenuItem } from '@models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuBar: MenuBar;
  menuItems: MenuItem[] = menuBase;
  visible: boolean = false;

  constructor(
    private sharedService: SharedService,
    private service: AuthService,
    private router: Router
  ) {
    sharedService.menuBar$.subscribe(menuBar => this.menuBar = menuBar);
  }

  ngOnInit(): void {
  }

  principal() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.navigate('/principal');
  }

  search(valor: string) {
    if(valor?.trim()) {
      this.navigate('/principal/repuestos/' + valor.trim());
    }
    this.visible = false;
  }

  navigate = (url: string) => this.router.navigate([url]);

  logout() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.service.logout();
    this.navigate('/');
  }
}