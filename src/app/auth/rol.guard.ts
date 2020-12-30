import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private service: AuthService, private snackBar: MatSnackBar) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const descripcion: string = route.data.modulo;
    const user = await this.service.getRolUser(this.service.id).toPromise();
    for(let rol of user.roles) {
      for(let modulo of rol.modulos) {
        if(modulo.descripcion == descripcion) {
          return true;
        }
      }
    }
    this.snackBar.open('No tiene permisos suficientes para acceder a esta sección', 'Error', {duration: 5000})
    return false;
  }
}