import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthControlService {

  constructor(private fb: FormBuilder) { }

  toCuentaForm() {
    return this.fb.group({
      id: [uuid()],
      nombreUsuario: ['', Validators.required],
      nombres: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['',[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      celular: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      clave: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]]
    });
  }

  toLoginForm() {
    return this.fb.group({
      nombreUsuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }
}