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
  styles: ['.w48 { width: 48% }', '.mr4 { margin-right: 4% }', '.no-error { margin-bottom: -1.25em; }']
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
      codigo: [this.repuesto ? this.repuesto.codigo : '', Validators.required],
      cantidad: [this.repuesto ? this.repuesto.stock : '', [Validators.pattern('^[0-9]*$')]],
      precio: [this.repuesto ? this.repuesto.precio : ''],
      notas: [this.repuesto ? this.repuesto.notas : '']
    });
  }

  async buscar(): Promise<boolean> {
    const codigo: string = this.form.get('codigo').value;
    if(codigo?.trim()) {
      const repuesto = await this.service.getRepuesto(codigo.trim()).toPromise();
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
        this.repuesto.stock = form.cantidad ? form.cantidad : 1;
        this.repuesto.precio = form.precio ? form.precio : this.repuesto.precio;
        this.repuesto.notas = form.notas;
        this.repuesto.descripcion = this._toDescripcion(this.repuesto);
        this.dialogRef.close(this.repuesto);
      }
    } else {
      this.showError('Algunos campos son inválidos');
    }
  }

  showError = (message: string) => this.snackBar.open(message, 'Error', {duration: 2000});
  
  private _toDescripcion(repuesto: Repuesto) {
    return repuesto.categoria.descripcion + ' ' + repuesto.marca.descripcion + ' ' +
      repuesto.modelo + ' ' + repuesto.epoca;
  }
}