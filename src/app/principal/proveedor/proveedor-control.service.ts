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
      convenio: [proveedor?.convenio ? proveedor.convenio : false],
      telefono: [proveedor?.telefono ? proveedor.telefono : ''],
      direccion: [proveedor?.direccion ? proveedor.direccion : ''],
      tipoProveedor: [proveedor?.tipoProveedor ? proveedor.tipoProveedor : ''],
      contacto: [proveedor?.contacto ? proveedor.contacto : ''],
      telefonoContacto: [proveedor?.telefonoContacto ? proveedor.telefonoContacto : ''],
      correoContacto: [proveedor?.correoContacto ? proveedor.correoContacto : '']
    });
  }
}
