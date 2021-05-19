import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Repuesto } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RepuestoControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(repuesto: Repuesto) {
    return this.fb.group({
      id: [repuesto?.id ? repuesto.id : uuid()],
      codigo: [repuesto?.codigo, Validators.required],
      categoria: this.fb.group({ id: [repuesto?.categoria?.id, Validators.required] }),
      marca: this.fb.group({ id: [repuesto?.marca?.id, Validators.required] }),
      modelo: [repuesto?.modelo, Validators.required],
      epoca: [repuesto?.epoca ? repuesto.epoca : ''],
      subMarca: [repuesto?.subMarca ? repuesto.subMarca : ''],
      stock: [repuesto?.stock, [Validators.required, Validators.pattern('^[0-9]{0,9}$')]],
      precio: [repuesto?.precio, [Validators.required, Validators.pattern('^[0-9]{0,9}(\\.[0-9]{1,3})?$')]],
      descripcion: [repuesto?.descripcion ? repuesto.descripcion : ''],
    });
  }
}