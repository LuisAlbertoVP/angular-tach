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
  data: string[][] = [];
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
    if((value || '').trim()) {
      this.criterios(filtro).push(new FormControl(value));
    }
    if(input) input.value = '';
  }

  selected(filtro: FormControl, event: MatAutocompleteSelectedEvent) {
    this.criterios(filtro).push(new FormControl(event.option.viewValue));
  }

  clearCriterios(filtro: FormControl, value: string) {
    if(value == 'between') {
      filtro.get('criterio1').setValue('');
      filtro.get('criterio2').setValue('');
    } else {
      this.criterios(filtro).clear();
    }
  }

  filter(valor: string, index: number) {
    const valorFiltrado = valor.toLowerCase(), filtro = this.busqueda.filtros[index];
    if(filtro?.data) {
      this.data[index] = filtro.data.filter(value => value.toLowerCase().indexOf(valorFiltrado) === 0);
    }
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;
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
        operador: [filtro?.operador ? filtro.operador : filtro?.tipo == 'text' ? 'contiene' : 'between'],
        tipo: [filtro?.tipo],
        tipoNativo: [filtro?.tipoNativo],
        checked: [filtro?.checked]
      }));
      this.data.push(filtro?.data ? filtro.data : []);
    }
    return newFiltros;
  }
}