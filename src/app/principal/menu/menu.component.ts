import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared_service/*';
import { Router } from '@angular/router';
import { menuBase, MenuBar, MenuItem } from '@models/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuBar: MenuBar;
  menuItems: MenuItem[] = menuBase;

  constructor(
    sharedService: SharedService,
    private router: Router
  ) {
    sharedService.menuBar$.subscribe(menuBar => this.menuBar = menuBar);
  }

  ngOnInit(): void {
  }

  navigate = (url: string) => this.router.navigate([url]);
}