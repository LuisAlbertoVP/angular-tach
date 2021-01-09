import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanLoad, CanActivate {

  constructor(private service: AuthService, private snackBar: MatSnackBar) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    return await this.checkPermisos(route.data.modulo);
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.checkPermisos(route.data.modulo);
  }

  async checkPermisos(descripcion: string): Promise<boolean> {
    const user = await this.service.getRolUser(this.service.id).toPromise();
    for(let rol of user.roles) {
      for(let modulo of rol.modulos) {
        if(modulo.descripcion == descripcion) {
          return true;
        }
      }
    }
    this.snackBar.open('No tiene permisos suficientes para acceder a esta sección', 'Error', {duration: 5000});
    return false;
  }
}