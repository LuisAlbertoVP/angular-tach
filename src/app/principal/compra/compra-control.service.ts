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
      descripcion: [compra?.descripcion],
      fecha: [compra?.fecha, Validators.required]
    });
  }
}