import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Proveedor } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProveedorControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(proveedor: Proveedor) {
    return this.fb.group({
      id: [proveedor?.id ? proveedor.id : uuid()],
      descripcion: [proveedor?.descripcion, [Validators.required, Validators.maxLength(50)]],
      telefono: [proveedor?.telefono ? proveedor.telefono : '', Validators.maxLength(25)],
      direccion: [proveedor?.direccion ? proveedor.direccion : ''],
      correo: [proveedor?.correo ? proveedor.correo : ''],
      webSite: [proveedor?.webSite ? proveedor.webSite : '']
    });
  }
}