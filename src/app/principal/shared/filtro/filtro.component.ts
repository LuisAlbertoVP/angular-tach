import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Busqueda, BusquedaBuilder, Filtro } from '@models/busqueda';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  data: string[][] = [];
  form: FormGroup = null;
  formDictionary: {[key: string]: FormGroup} = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public busqueda: BusquedaBuilder,
    private dialogRef: MatDialogRef<FiltroComponent>,
    private fb: FormBuilder
  ) {}

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  ngOnInit(): void {
    const nextBusqueda: Busqueda = this.busqueda.nextBusqueda;
    this.form = this.fb.group({
      filtros: this.fb.array(this._toFormArray(this.busqueda.rootBusqueda.filtros)),
      estado: nextBusqueda?.estado ? nextBusqueda.estado : true,
      operadorLogico: '&&'
    });
    if(nextBusqueda?.operadorLogico == '&&') this._setFormArray(nextBusqueda.filtros);
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
    const valorFiltrado = valor.toLowerCase(), filtro = this.busqueda.rootBusqueda.filtros[index];
    if(filtro.data) {
      this.data[index] = filtro.data.filter(value => value.toLowerCase().indexOf(valorFiltrado) === 0);
    }
  }

  guardar() {
    const busqueda: Busqueda = this.form.getRawValue();
    busqueda.filtros = this._buildNewFiltros(busqueda.filtros);
    busqueda.tiempo = Date.now();
    this.dialogRef.close(busqueda);
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;
  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  private _buildNewFiltros(filtros: Filtro[], array: Filtro[] = []) {
    for(let filtro of filtros) {
      if(filtro.operador == 'between') {
        if(filtro.criterio1 && filtro.criterio2) {
          if(filtro.tipo == 'number' && filtro.tipoNativo == 'int') {
            filtro.criterio1 = Math.trunc(+filtro.criterio1).toString();
            filtro.criterio2 = Math.trunc(+filtro.criterio2).toString();
          }
          array.push(filtro);
        }
      } else {
        if(filtro.criterios.length > 0) array.push(filtro);
      }
    }
    return array;
  }

  private _setFormArray(filtros: Filtro[]) {
    for(let filtro of filtros) {
      if(filtro.id != 'Id') {
        const criterios = this.formDictionary[filtro.id].get('criterios') as FormArray;
        for(let criterio of filtro.criterios) {
          criterios.push(this.fb.control(criterio));
        }
        this.formDictionary[filtro.id].get('criterio1').setValue(filtro.criterio1);
        this.formDictionary[filtro.id].get('criterio2').setValue(filtro.criterio2);
        this.formDictionary[filtro.id].get('operador').setValue(filtro.operador);
      }
    }
  }
  
  private _toFormArray(filtros: Filtro[]) {
    let newFiltros = [];
    for(let filtro of filtros) {
      const form = this.fb.group({
        id: [filtro.id],
        nombre: [filtro.nombre],
        criterios: this.fb.array([]),
        criterio1: [''], 
        criterio2: [''], 
        operador: [filtro.tipo == 'text' ? 'contiene' : 'between'],
        tipo: [filtro.tipo],
        tipoNativo: [filtro?.tipoNativo]
      });
      newFiltros.push(form);
      this.formDictionary[filtro.id] = form;
      this.data.push(filtro?.data ? filtro.data : []);
    }
    return newFiltros;
  }
}