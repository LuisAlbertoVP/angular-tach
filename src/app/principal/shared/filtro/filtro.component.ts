import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      operador: '&&'
    });
    if(nextBusqueda?.operador == '&&') this._setFormArray(nextBusqueda.filtros);
  }

  addCriterio(filtro: FormControl, event: MatChipInputEvent) {
    const input = event.chipInput.inputElement, value = event.value;
    if((value || '').trim()) {
      this.criterios(filtro).push(new FormControl(value));
    }
    if(input) input.value = '';
  }

  selected(filtro: FormControl, event: MatAutocompleteSelectedEvent) {
    this.criterios(filtro).push(new FormControl(event.option.viewValue));
  }

  filter(valor: string, index: number) {
    const valorFiltrado = valor.toLowerCase(), filtro = this.busqueda.rootBusqueda.filtros[index];
    if(filtro.data) {
      this.data[index] = filtro.data.filter(value => value.toLowerCase().indexOf(valorFiltrado) === 0);
    }
  }

  guardar() {
    if(this.form.valid) {
      const busqueda: Busqueda = this.form.getRawValue();
      busqueda.filtros = this._buildNewFiltros(busqueda.filtros);
      busqueda.tiempo = Date.now();
      this.dialogRef.close(busqueda);
    }
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;
  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  private _buildNewFiltros(filtros: Filtro[], array: Filtro[] = []) {
    for(let filtro of filtros) {
      if(filtro.condicion == 'between' || filtro.condicion == 'nobetween') {
        filtro.criterio1 = filtro.criterio1?.toString();
        filtro.criterio2 = filtro.criterio2?.toString();
        if(filtro.criterio1 && filtro.criterio2) {
          if(filtro.tipoNativo == 'int') {
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
        if(filtro.tipo == 'text') {
          const criterios = this.formDictionary[filtro.id].get('criterios') as FormArray;
          for(let criterio of filtro.criterios) {
            criterios.push(this.fb.control(criterio));
          }
        } else {
          this.formDictionary[filtro.id].get('criterio1').setValue(filtro.criterio1);
          this.formDictionary[filtro.id].get('criterio2').setValue(filtro.criterio2);
        }
        this.formDictionary[filtro.id].get('condicion').setValue(filtro.condicion);
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
        condicion: [filtro.tipo == 'text' ? 'contiene' : 'between'],
        tipo: [filtro.tipo],
        tipoNativo: [filtro?.tipoNativo]
      });
      if(filtro.tipo == 'number') {
        if(filtro.tipoNativo == 'int') {
          this._addValidator(form, '^[0-9]{0,9}$', '^[0-9]{0,9}$');
        } else {
          this._addValidator(form, '^[0-9]{0,9}(\\.[0-9]{1,3})?$', '^[0-9]{0,9}(\\.[0-9]{1,3})?$');
        }
      }
      newFiltros.push(form);
      this.formDictionary[filtro.id] = form;
      this.data.push(filtro?.data ? filtro.data : []);
    }
    return newFiltros;
  }

  private _addValidator(form: FormGroup, regex1: string, regex2: string) {
    form.get('criterio1').setValidators(Validators.pattern(regex1));
    form.get('criterio2').setValidators(Validators.pattern(regex2));
  }
}