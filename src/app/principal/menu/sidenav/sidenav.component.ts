import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Output('closeSidenav') closeSidenav = new EventEmitter();

  constructor(
    private router: Router,
    public service: AuthService,
    private sharedService: SharedService
  ) {}

  logout() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.service.logout();
    this.navigate('/');
  }

  navigate(link: string) {
    this.closeSidenav.emit();
    this.router.navigate([link]);
  }
  
  principal() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.navigate('/principal');
  }
}