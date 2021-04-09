import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationDialog } from '@models/confirmacion';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent {
  dialog: ConfirmationDialog =  null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog) {
    switch(data.accion) {
      case "Eliminar": data.titulo = 'Advertencia'; break;
      case "Continuar": data.titulo = 'Mensaje'; break;
    }
    this.dialog = data;
  }
}