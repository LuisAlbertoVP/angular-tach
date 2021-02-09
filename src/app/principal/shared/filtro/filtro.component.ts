import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Busqueda, Filtro } from '@models/busqueda';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  form: FormGroup = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public busqueda: Busqueda,
    private dialogRef: MatDialogRef<FiltroComponent>,
    private fb: FormBuilder
  ) {}

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      filtros: this.fb.array(this._getFiltrosForm(this.busqueda.filtros)),
      estado: this.busqueda.estado,
      operadorLogico: '&&'
    });
  }

  addCriterio(filtro: FormControl, event: MatChipInputEvent) {
    const input = event.input, value = event.value;
    if ((value || '').trim()) {
      this.criterios(filtro).push(new FormControl(value));
    }
    if (input) {
      input.value = '';
    }
  }

  selected(filtro: FormControl, event: MatAutocompleteSelectedEvent) {
    this.criterios(filtro).push(new FormControl(event.option.viewValue));
  }

  clearCriterio1 = (filtro: FormControl) => filtro.get('criterio1').setValue('');
  clearCriterio2 = (filtro: FormControl) => filtro.get('criterio2').setValue('');

  clearCriterios(filtro: FormControl, value: string) {
    if(value == 'between') {
      this.clearCriterio1(filtro);
      this.clearCriterio2(filtro);
    } else {
      this.criterios(filtro).clear();
    }
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;
  data = (filtro: FormControl) => filtro.get('data') as FormArray;
  guardar = () => this.dialogRef.close(this.form.getRawValue());
  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  private _getFiltrosForm(filtros: Filtro[]) {
    let newFiltros = [];
    for(let filtro of filtros) {
      newFiltros.push(this.fb.group({
        id: [filtro.id],
        nombre: [filtro.nombre],
        criterios: this.fb.array(filtro?.criterios ? filtro.criterios : []),
        criterio1: [filtro?.criterio1 ? filtro.criterio1 : ''], 
        criterio2: [filtro?.criterio2 ? filtro.criterio2 : ''], 
        operador: [filtro?.operador ? filtro.operador : filtro?.esFecha ? 'between' : 'contiene'],
        data: this.fb.array(filtro?.data ? filtro.data : []),
        esFecha: [filtro?.esFecha],
        checked: [filtro?.checked]
      }));
    }
    return newFiltros;
  }
}