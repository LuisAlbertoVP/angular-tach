import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User, Rol } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UsuarioControlService {

  constructor(private fb: FormBuilder) { }

  toRoles(roles: Rol[] = [], ids: string[] = []): string[] {
    for(let rol of roles) {
      ids.push(rol.id);
    }
    return ids;
  }

  toFormGroup(user: User) {
    return this.fb.group({
      id: [user?.id ? user.id : uuid()],
      nombreUsuario: [user?.nombreUsuario, [Validators.required, Validators.maxLength(25)]],
      nombres: [user?.nombres, [Validators.required, Validators.maxLength(50)]],
      cedula: [user?.cedula, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: [user?.correo,[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      direccion: [user?.direccion, Validators.required],
      telefono: [user?.telefono, [Validators.required, Validators.maxLength(25)]],
      celular: [user?.celular, [Validators.required, Validators.maxLength(25)]],
      fechaNacimiento: [user?.fechaNacimiento, Validators.required],
      fechaContratacion: [user?.fechaContratacion, Validators.required],
      salario: [user?.salario, [Validators.required, Validators.pattern('^[0-9]{0,9}(\\.[0-9]{1,4})?$')]],
      roles: [this.toRoles(user?.roles), Validators.required],
      clave: ['']
    });
  }
}