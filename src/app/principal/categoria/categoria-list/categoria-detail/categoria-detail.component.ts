import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Base } from '@models/tach';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { CategoriaService } from '../../categoria.service';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-categoria-detail',
  templateUrl: 'categoria-detail.component.html',
})
export class CategoriaDetailComponent implements OnInit {
  isMobile: boolean = false;
  form = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });

  constructor(
    sharedService: SharedService,
    public dialogRef: MatDialogRef<CategoriaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public categoria: Base,
    private auth: AuthService,
    private service: CategoriaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    if(this.categoria) {
      this.form.patchValue(this.categoria);
    }
  }

  guardar() {
    if(this.form.valid) {
      const categoria = this.form.getRawValue();
      categoria.id = this.categoria ? categoria.id : uuid();
      categoria.usuarioIngreso = this.auth.nombreUsuario;
      categoria.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(categoria).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.snackBar.open(response.body.result, 'Ok', {duration: 2000, panelClass: ['success']});
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Campo invalido', 'Error', {duration: 2000});
    }
  }
}