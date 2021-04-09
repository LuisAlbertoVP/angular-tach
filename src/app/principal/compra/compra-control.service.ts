import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Compra } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CompraControlService {

  constructor(private fb: FormBuilder) {}

  generateId() {
    return uuid();
  }

  toFormGroup(compra : Compra) {
    return this.fb.group({
      id: [compra?.id ? compra.id : uuid()],
      proveedor: this.fb.group({
        id: [compra?.proveedor?.id, Validators.required]
      }),
      descripcion: [compra?.descripcion],
      fecha: [compra?.fecha, Validators.required],
      numero: [compra?.numero, Validators.required],
      vendedor: [compra?.vendedor],
      soldTo: [compra?.soldTo],
      shipTo: [compra?.shipTo],
      ruta: [compra?.ruta]
    });
  }
}