import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Repuesto } from '@models/entity';

@Injectable({
  providedIn: 'root'
})
export class RepuestoControlService {

  constructor(private fb: FormBuilder) { }

  toFormGroup(repuesto: Repuesto) {
    return this.fb.group({
      id: [repuesto?.id],
      codigo: [repuesto?.codigo, Validators.required],
      categoria: this.fb.group({ id: [repuesto?.categoria?.id, Validators.required] }),
      marca: this.fb.group({ id: [repuesto?.marca?.id, Validators.required] }),
      modelo: [repuesto?.modelo, Validators.required],
      epoca: [repuesto?.epoca ? repuesto.epoca : ''],
      subMarca: [repuesto?.subMarca ? repuesto.subMarca : ''],
      stock: [repuesto?.stock, Validators.required],
      precio: [repuesto?.precio, Validators.required],
      descripcion: [repuesto?.descripcion ? repuesto.descripcion : ''],
    });
  }
}