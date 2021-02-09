import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(
    private service: AuthService, 
    private router: Router
  ) {}

  canLoad(route: Route): boolean {
    return this._checkLogin();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._checkLogin(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  private _checkDate = (): boolean => Date.now() <  Date.parse(this.service.tokenExpiration);

  private _checkLogin(route?: string): boolean {
    if(route && route == '/') {
      if(!this._hasToken()) {
        return true; 
      }
      this.router.navigate(['/principal']);
      return false;
    } else {
      if(this._hasToken()) {
        return true; 
      }
      this.router.navigate(['/']);
      return false;
    }
  }

  private _hasToken = () : boolean => this.service.token && this._checkDate();
}