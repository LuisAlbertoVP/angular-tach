import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Repuesto, Base } from '@models/tach';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { RepuestoService } from '../../repuesto.service';
import { RepuestoControlService } from '../../repuesto-control.service';
import { v4 as uuid } from 'uuid';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-repuesto-detail',
  templateUrl: './repuesto-detail.component.html',
  styles: ['.h160 { height: 160px; }']
})
export class RepuestoDetailComponent implements OnInit {
  marcas: Base[] = [];
  categorias: Base[] = [];
  isMobile: boolean = false;
  form: FormGroup;

  constructor(
    sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public repuesto: Repuesto,
    private dialogRef: MatDialogRef<RepuestoDetailComponent>,
    private auth: AuthService,
    private service: RepuestoService,
    private control: RepuestoControlService,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.service.getForm().subscribe(repuestoForm => {
      this.marcas = repuestoForm.marcas;
      this.categorias = repuestoForm.categorias;
      this.form = this.control.toFormGroup(this.repuesto);
    });
  }

  guardar() {
    if(this.form.valid) {
      const repuesto: Repuesto = this.form.getRawValue();
      repuesto.id = this.repuesto ? repuesto.id : uuid();
      repuesto.usuarioIngreso = this.auth.nombreUsuario;
      repuesto.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(repuesto).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.snackBar.open(response.body.result, 'Ok', {duration: 2000, panelClass: ['success']});
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Algunos campos son invalidos', 'Error', {duration: 2000});
    }
  }
}