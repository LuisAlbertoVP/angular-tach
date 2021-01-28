import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Busqueda } from '@models/busqueda';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SharedService } from '@shared_service/*';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<FiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public busqueda: Busqueda,
    private service: SharedService
  ) {}

  ngOnInit(): void {
    this.form = this.service.getForm(this.busqueda);
  }

  get filtros() {
    return this.form.get('filtros') as FormArray;
  }

  criterios = (filtro: FormControl) => filtro.get('criterios') as FormArray;

  addCriterio(filtro: FormControl, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.criterios(filtro).push(new FormControl(value));
    }
    if (input) {
      input.value = '';
    }
  }

  clearCriterios(filtro: FormControl, value: string) {
    switch(value) {
      case 'multiple': this.criterios(filtro).clear(); break;
      case 'between': this.clearCriterio1(filtro); this.clearCriterio2(filtro); break;
      default: this.clearCriterio1(filtro); break;
    }
  }

  removeCriterio = (filtro: FormControl, position: number) => this.criterios(filtro).removeAt(position);

  clearCriterio1 = (filtro: FormControl) => filtro.get('criterio1').setValue('');

  clearCriterio2 = (filtro: FormControl) => filtro.get('criterio2').setValue('');

  guardar = () => this.dialogRef.close(this.form.getRawValue());
}