import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Busqueda } from '@models/busqueda';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public busqueda: Busqueda,
    private fb: FormBuilder,
  ) {}

  private getFiltros() {
    let filtros = [];
    for(let filtro of this.busqueda.filtros) {
      filtros.push(this.fb.group({
        id: [filtro.id],
        nombre: [filtro.nombre],
        criterios: this.fb.array(filtro?.criterios ? filtro.criterios : []),
        criterio1: [filtro?.criterio1 ? filtro.criterio1.replace(/%/g, '') : ''], 
        criterio2: [filtro?.criterio2 ? filtro.criterio2 : ''], 
        condicion: [filtro?.condicion ? filtro.condicion : 'like'],
        esFecha: [filtro.esFecha],
        checked: [filtro.checked]
      }))
    }
    return filtros;
  }

  private getForm() {
    return this.fb.group({
      filtros: this.fb.array(this.getFiltros()),
      estado: this.busqueda.estado
    });
  }

  ngOnInit(): void {
    this.form = this.getForm();
  }

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;

  addCriterio(filtro: FormControl, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.criterios(filtro).push(this.fb.control(value));
    }
    if (input) {
      input.value = '';
    }
  }

  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  clearCriterio1 = (filtro: FormControl) => filtro.get('criterio1').setValue('');

  clearCriterio2 = (filtro: FormControl) => filtro.get('criterio2').setValue('');

  clearCriterios(filtro: FormControl) {
    this.clearCriterio1(filtro);
    this.clearCriterio2(filtro);
    this.criterios(filtro).clear();
  }

  guardar = () => this.dialogRef.close(this.form.getRawValue());
}