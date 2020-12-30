import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(private service: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    return this.checkLogin();
  }

  private checkDate(): boolean {
    return Date.now() < +this.service.tokenExpiration * 1000;
  }
  
  checkLogin(): boolean {
    if(this.service.token && this.checkDate()) { 
      return true; 
    }
    this.service.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
