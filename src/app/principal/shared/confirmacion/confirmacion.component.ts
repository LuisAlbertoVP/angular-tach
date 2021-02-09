import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationAccept, ConfirmationData, ConfirmationDelete, ConfirmationDialog } from '@models/confirmacion';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent {
  dialog: ConfirmationDialog =  null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationData) {
    switch(data.accion) {
      case "Eliminar": this.dialog = new ConfirmationDelete().generate(data.seccion); break;
      case "Continuar": this.dialog = new ConfirmationAccept().generate(data.seccion); break;
    }
  }
}