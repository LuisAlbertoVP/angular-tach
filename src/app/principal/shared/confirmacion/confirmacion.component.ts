import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html'
})
export class ConfirmacionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public mensaje: string) {}

  ngOnInit(): void {
  }
}