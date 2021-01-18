import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { listModulos } from '@models/modulos';
import { Modulo, Rol } from '@models/auth';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { RolService } from '../../rol.service';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-rol-detail',
  templateUrl: './rol-detail.component.html'
})
export class RolDetailComponent implements OnInit {
  modulos: Modulo[];
  isMobile: boolean = false;
  form = this.fb.group({
    id: [''],
    descripcion: ['', Validators.required]
  });

  constructor(
    sharedService: SharedService,
    public dialogRef: MatDialogRef<RolDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public rol: Rol,
    private auth: AuthService,
    private service: RolService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.modulos = JSON.parse(JSON.stringify(listModulos));
    if(this.rol) {
      this.form.patchValue(this.rol);
      this.setChecked()
    }
  }

  setChecked() {
    let temp = {};
    for(let modulo of this.modulos) {
      temp[modulo.id] = modulo;
    }
    for(let modulo of this.rol.modulos) {
      if(modulo.id in temp) {
        temp[modulo.id].checked = true;
      }
    }
  }

  updateStatus = (position: number, checked: boolean) => this.modulos[position].checked = checked;

  guardar() {
    if(this.form.valid) {
      const rol: Rol = this.form.getRawValue();
      rol.id = this.rol ? rol.id : uuid();
      rol.usuarioIngreso = this.auth.nombreUsuario;
      rol.usuarioModificacion = this.auth.nombreUsuario;
      rol.modulos = this.modulos.filter(modulo => modulo.checked);
      this.service.insertOrUpdate(rol).subscribe((response: HttpResponse<any>) => {
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