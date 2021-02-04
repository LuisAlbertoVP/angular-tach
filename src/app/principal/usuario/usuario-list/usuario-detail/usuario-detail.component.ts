import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { User, Rol } from '@models/entity';
import { SharedService } from '@shared/shared.service';
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
  form: FormGroup;
  hide: boolean = true;
  isMobile: boolean = false;  
  roles: Rol[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuario: User,
    private auth: AuthService,
    private control: UsuarioControlService,
    private dialogRef: MatDialogRef<UsuarioDetailComponent>,
    private service: UsuarioService,
    private sharedService: SharedService,
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

  guardar() {
    if(this.form.valid) {
      const usuario = this.form.getRawValue();
      usuario.id = this.usuario ? usuario.id : uuid();
      usuario.usuarioIngreso = this.auth.nombreUsuario;
      usuario.usuarioModificacion = this.auth.nombreUsuario;
      usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format('YYYY-MM-DD');
      usuario.fechaContratacion = moment(usuario.fechaContratacion).format('YYYY-MM-DD');
      usuario.clave = usuario.clave ? SHA256(usuario.clave).toString() : '';
      let roles: Rol[] = [];
      for(let i = 0; i < usuario.roles.length; i++) {
        roles.push({ id: (usuario.roles[i] as string), descripcion: ''});
      }
      usuario.roles = roles;
      this.service.insertOrUpdate(usuario).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.snackBar.open('Algunos campos son invalidos', 'Error', {duration: 2000});
    }
  }
}