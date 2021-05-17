import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PrintBusqueda } from '@models/busqueda';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-print-context',
  templateUrl: './print-context.component.html',
  styles: ['.checks > * { display: block }']
})
export class PrintContextComponent implements OnInit {
  form: FormGroup = null;
  isMobile: boolean = false;

  constructor(
    sharedService: SharedService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PrintContextComponent>
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.fb.group({ 
      isHeader: [true],
      isPrice: [true],
      isDescription: [true]
    });
  }

  guardar() {
    const printBusqueda: PrintBusqueda = this.form.getRawValue();
    this.dialogRef.close(printBusqueda);
  }
}