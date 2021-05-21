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
      orden: [compra?.orden, Validators.maxLength(25)],
      descripcion: [compra?.descripcion],
      fecha: [compra?.fecha, Validators.required],
      tipoDocumento: [compra?.tipoDocumento, Validators.required],
      numero: [compra?.numero, [Validators.required, Validators.maxLength(25)]],
      vendedor: [compra?.vendedor],
      soldTo: [compra?.soldTo],
      shipTo: [compra?.shipTo],
      ruta: [compra?.ruta]
    });
  }
}