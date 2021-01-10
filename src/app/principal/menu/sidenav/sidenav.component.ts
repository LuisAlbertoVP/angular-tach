import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared_service/*';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output('closeSidenav') closeSidenav = new EventEmitter();

  constructor(
    private sharedService: SharedService,
    public service: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  principal() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.navigate('/principal');
  }

  navigate(link: string) {
    this.closeSidenav.emit();
    this.router.navigate([link]);
  }

  logout() {
    this.sharedService.buildMenuBar({ title: 'Principal' });
    this.service.logout();
    this.navigate('/');
  }
}