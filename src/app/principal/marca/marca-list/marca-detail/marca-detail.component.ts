import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Marca } from '@models/entity';
import { SharedService } from '@shared/shared.service';
import { AuthService } from '@auth_service/*';
import { MarcaService } from '../../marca.service';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-marca-detail',
  templateUrl: 'marca-detail.component.html',
})
export class MarcaDetailComponent implements OnInit {
  form = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });
  isMobile: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public marca: Marca,
    private auth: AuthService,
    private dialogRef: MatDialogRef<MarcaDetailComponent>,
    private fb: FormBuilder,
    private service: MarcaService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    if(this.marca) {
      this.form.patchValue(this.marca);
    }
  }

  guardar() {
    if(this.form.valid) {
      const marca = this.form.getRawValue();
      marca.id = this.marca ? marca.id : uuid();
      marca.usuarioIngreso = this.auth.nombreUsuario;
      marca.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(marca).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Campo invalido', 'Error', {duration: 2000});
    }
  }
}