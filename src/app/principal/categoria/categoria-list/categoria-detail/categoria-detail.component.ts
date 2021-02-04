import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Categoria } from '@models/entity';
import { SharedService } from '@shared/shared.service';
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
  form = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });
  isMobile: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public categoria: Categoria,
    private auth: AuthService,
    private dialogRef: MatDialogRef<CategoriaDetailComponent>,
    private fb: FormBuilder,
    private service: CategoriaService,
    private sharedService: SharedService,
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
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Campo invalido', 'Error', {duration: 2000});
    }
  }
}