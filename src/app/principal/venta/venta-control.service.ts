import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Venta } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class VentaControlService {

  constructor(private fb: FormBuilder) {}

  generateId() {
    return uuid();
  }

  toFormGroup(venta : Venta) {
    return this.fb.group({
      id: [venta?.id ? venta.id : uuid()],
      cliente: this.fb.group({
        id: [venta?.cliente?.id]
      }),
      descripcion: [venta?.descripcion],
      direccion: [venta?.direccion],
      fecha: [venta?.fecha, Validators.required]
    });
  }
}