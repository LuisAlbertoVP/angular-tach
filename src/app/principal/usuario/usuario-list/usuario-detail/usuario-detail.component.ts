import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { User, Rol } from '@models/auth';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { UsuarioService } from '../../usuario.service';
import { UsuarioControlService } from '../../usuario-control.service';
import { SHA256 } from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html'
})
export class UsuarioDetailComponent implements OnInit {
  hide: boolean = true;
  roles: Rol[] = [];
  isMobile: boolean = false;
  form: FormGroup;

  constructor(
    sharedService: SharedService,
    public dialogRef: MatDialogRef<UsuarioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: User,
    private auth: AuthService,
    private service: UsuarioService,
    private control: UsuarioControlService,
    private snackBar: MatSnackBar
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.service.getForm().subscribe(usuarioForm => {
      this.roles = usuarioForm.roles;
      this.form = this.control.toFormGroup(this.usuario);
    });
  }

  onNoClick = (status?: boolean): void => this.dialogRef.close(status);

  guardar() {
    if(this.form.valid) {
      const usuario: User = this.form.getRawValue();
      usuario.id = this.usuario ? usuario.id : uuid();
      usuario.usrIngreso = this.auth.nombreUsuario;
      usuario.usrModificacion = this.auth.nombreUsuario;
      usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format('YYYY-MM-DD');
      usuario.fechaContratacion = usuario.fechaContratacion ? moment(usuario.fechaContratacion).format('YYYY-MM-DD') : '';
      usuario.clave = usuario.clave ? SHA256(usuario.clave).toString() : '';
      this.service.insertOrUpdate(usuario).subscribe((response: HttpResponse<string>) => {
        if(response.status == 200) {
          this.snackBar.open(response.body, 'Ok', {duration: 2000, panelClass: ['success']});
          this.onNoClick(true);
        }
      });
    } else {
      this.snackBar.open('Algunos campos son invalidos', 'Error', {duration: 2000});
    }
  }
}