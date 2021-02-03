import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Repuesto } from '@models/entity';
import { SharedService } from '@shared_service/shared';
import { VentaService } from '../../venta.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-repuesto-venta',
  templateUrl: './repuesto-venta.component.html'
})
export class RepuestoVentaComponent implements OnInit {
  cantidad = this.fb.control(0, [Validators.required, Validators.min(1)]);
  isMobile: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public repuesto: Repuesto,
    sharedService: SharedService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RepuestoVentaComponent>,
    private service: VentaService,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.cantidad.patchValue(this.repuesto?.stock);
  }

  buscar(id: string) {
    if(id?.trim()) {
      this.service.getRepuesto(id.trim()).subscribe(repuesto => this.repuesto = repuesto);
    } else {
      this.showError('Ingrese un criterio de búsqueda');
    }
  }

  guardar() {
    if(this.cantidad.valid) {
      if(this.repuesto) {
        this.repuesto.stock = this.cantidad.value;
        this.repuesto.descripcion = this.descripcion(this.repuesto);
        this.dialogRef.close(this.repuesto);
      } else {
        this.showError('Realice una búsqueda del repuesto');
      }
    } else {
      this.showError('Cantidad inválida');
    }
  }

  private descripcion(repuesto: Repuesto) {
    return repuesto.categoria.descripcion + ' ' + repuesto.marca.descripcion + ' ' +
      repuesto.modelo + ' ' + repuesto.epoca;
  }

  showError = (message: string) => this.snackBar.open(message, 'Error', {duration: 2000});
}