import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ClienteControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(cliente: Cliente) {
    return this.fb.group({
      id: [cliente?.id ? cliente.id : uuid()],
      nombres: [cliente?.nombres, [Validators.required, Validators.maxLength(50)]],
      cedula: [cliente?.cedula, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: [cliente?.correo,[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      direccion: [cliente?.direccion, Validators.required],
      telefono: [cliente?.telefono, [Validators.required, Validators.maxLength(25)]],
      celular: [cliente?.celular, [Validators.required, Validators.maxLength(25)]],
      fechaNacimiento: [cliente?.fechaNacimiento, Validators.required],
      tipoCliente: [cliente?.tipoCliente ? cliente.tipoCliente : 'Cliente', Validators.required]
    });
  }
}