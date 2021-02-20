import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { RolService } from '../../rol.service';
import { SharedService } from '@shared/shared.service';
import { listModulos, Modulo } from '@models/menu';
import { Rol } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-rol-detail',
  templateUrl: './rol-detail.component.html'
})
export class RolDetailComponent implements OnInit {
  form: FormGroup = null;
  isMobile: boolean = false;
  modulos: Modulo[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public rol: Rol,
    private auth: AuthService,
    private dialogRef: MatDialogRef<RolDetailComponent>,
    private fb: FormBuilder,
    private service: RolService,
    private sharedService: SharedService
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.rol?.id],
      descripcion: [this.rol?.descripcion, Validators.required]
    });
    this.modulos = JSON.parse(JSON.stringify(listModulos));
    this.modulos = this.modulos.filter(modulo => modulo.id != 0);
    if(this.rol) {
      this.setChecked()
    }
  }

  guardar() {
    if(this.form.valid) {
      const rol: Rol = this.form.getRawValue();
      rol.id = this.rol ? rol.id : uuid();
      rol.usuarioIngreso = this.auth.nombreUsuario;
      rol.usuarioModificacion = this.auth.nombreUsuario;
      rol.modulos = this.modulos.filter(modulo => modulo.checked);
      this.service.insertOrUpdate(rol).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son invalidos');
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
}