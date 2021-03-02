import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepuestoService } from '../../repuesto/repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Repuesto } from '@models/entity';

@Component({
  selector: 'app-repuesto-search',
  templateUrl: './repuesto-search.component.html',
  styles: ['.w90 { width: 90% }', '.w10 { width: 10% }']
})
export class RepuestoSearchComponent implements OnInit {
  form: FormGroup = null;
  isMobile: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public repuesto: Repuesto,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RepuestoSearchComponent>,
    private service: RepuestoService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.fb.group({ 
      busqueda: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  async buscar() {
    const busqueda: string = this.form.get('busqueda').value;
    if(busqueda?.trim()) {
      const repuesto = await this.service.getRepuesto(busqueda.trim()).toPromise();
      if(repuesto) {
        this.repuesto = repuesto;
      } else {
        this.sharedService.showErrorMessage('No existe el repuesto');
      }
      return repuesto ? true : false;
    } else {
      this.showError('Ingrese un criterio de búsqueda');
      return false;
    }
  }

  async guardar() {
    const form = this.form.getRawValue();
    if(this.form.valid) {
      const isValid: boolean = await this.buscar();
      if(isValid) {
        this.repuesto.stock = form.cantidad;
        this.repuesto.descripcion = this._descripcion(this.repuesto);
        this.dialogRef.close(this.repuesto);
      }
    } else {
      this.showError('Algunos campos son inválidos');
    }
  }

  showError = (message: string) => this.snackBar.open(message, 'Error', {duration: 2000});
  
  private _descripcion(repuesto: Repuesto) {
    return repuesto.categoria.descripcion + ' ' + repuesto.marca.descripcion + ' ' +
      repuesto.modelo + ' ' + repuesto.epoca;
  }
}