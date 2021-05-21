import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '@models/entity';

@Injectable({
  providedIn: 'root'
})
export class CuentaControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(usuario: User) {
    return this.fb.group({
      nombres: [usuario?.nombres, [Validators.required, Validators.maxLength(50)]],
      cedula: [usuario?.cedula, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: [usuario?.correo,[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      direccion: [usuario?.direccion, Validators.required],
      telefono: [usuario?.telefono, [Validators.required, Validators.maxLength(25)]],
      celular: [usuario?.celular, [Validators.required, Validators.maxLength(25)]],
      fechaNacimiento: [usuario?.fechaNacimiento, Validators.required],
      nombreUsuario: [usuario?.nombreUsuario, [Validators.required, Validators.maxLength(25)]],
      clave: [usuario?.clave, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]
    });
  }
}