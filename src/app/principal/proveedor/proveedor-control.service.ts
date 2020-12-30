import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Proveedor } from '@models/tach';

@Injectable({
  providedIn: 'root'
})
export class ProveedorControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(proveedor: Proveedor) {
    return this.fb.group({
      id: [proveedor?.id],
      descripcion: [proveedor?.descripcion, Validators.required],
      convenio: [proveedor?.convenio],
      telefono: [proveedor?.telefono],
      direccion: [proveedor?.direccion],
      tipoProveedor: [proveedor?.tipoProveedor],
      contacto: [proveedor?.contacto],
      telefonoContacto: [proveedor?.telefonoContacto],
      correoContacto: [proveedor?.correoContacto]
    });
  }
}
