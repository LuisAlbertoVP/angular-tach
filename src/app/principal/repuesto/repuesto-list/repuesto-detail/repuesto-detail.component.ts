import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { RepuestoControlService } from '../../repuesto-control.service';
import { RepuestoService } from '../../repuesto.service';
import { SharedService } from '@shared/shared.service';
import { Categoria, Marca, Repuesto } from '@models/entity';

@Component({
  selector: 'app-repuesto-detail',
  templateUrl: './repuesto-detail.component.html',
  styles: ['.h100 { height: 100px; }', '.padding { padding-left: 50px; }', '.wd { width: 85%; }']
})
export class RepuestoDetailComponent implements OnInit {
  categorias: Categoria[] = [];
  form: FormGroup = null;
  marcas: Marca[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public repuesto: Repuesto,
    private auth: AuthService,
    private control: RepuestoControlService,
    private dialogRef: MatDialogRef<RepuestoDetailComponent>,
    private service: RepuestoService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.service.getForm().subscribe(repuestoForm => {
      this.categorias = repuestoForm.categorias;
      this.marcas = repuestoForm.marcas;
      this.form = this.control.toFormGroup(this.repuesto);
    });
  }

  guardar() {
    if(this.form.valid) {
      const repuesto: Repuesto = this.form.getRawValue();
      repuesto.usuarioIngreso = this.auth.nombreUsuario;
      repuesto.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(repuesto).subscribe(response => {
        if(response?.status == 200) {
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}