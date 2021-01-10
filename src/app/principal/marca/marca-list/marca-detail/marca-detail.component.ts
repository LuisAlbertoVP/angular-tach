import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Base } from '@models/tach';
import { SharedService } from '@shared_service/shared';
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
  isMobile: boolean = false;
  form = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });

  constructor(
    sharedService: SharedService,
    public dialogRef: MatDialogRef<MarcaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public marca: Base,
    private auth: AuthService,
    private service: MarcaService,
    private fb: FormBuilder,
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
      marca.usrIngreso = this.auth.nombreUsuario;
      marca.usrModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(marca).subscribe((response: HttpResponse<string>) => {
        if(response.status == 200) {
          this.snackBar.open(response.body, 'Ok', {duration: 2000, panelClass: ['success']});
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Campo invalido', 'Error', {duration: 2000});
    }
  }
}