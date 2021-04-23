import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { UsuarioControlService } from '../../usuario-control.service';
import { UsuarioService } from '../../usuario.service';
import { User, Rol } from '@models/entity';
import { SHA256 } from 'crypto-js';
import * as moment from 'moment';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html'
})
export class UsuarioDetailComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  isMobile: boolean = false;  
  roles: Rol[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuario: User,
    private auth: AuthService,
    private control: UsuarioControlService,
    private dialogRef: MatDialogRef<UsuarioDetailComponent>,
    private service: UsuarioService,
    private sharedService: SharedService
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
      let roles: Rol[] = [];
      for(let i = 0; i < usuario.roles.length; i++) {
        roles.push({ id: (usuario.roles[i] as string), descripcion: ''});
      }
      usuario.roles = roles;
      usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format('YYYY-MM-DD');
      usuario.fechaContratacion = moment(usuario.fechaContratacion).format('YYYY-MM-DD');
      usuario.clave = usuario.clave ? SHA256(usuario.clave).toString() : '';
      usuario.usuarioIngreso = this.auth.nombreUsuario;
      usuario.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(usuario).subscribe(response => {
        if(response?.status == 200) {
          this.sharedService.showMessage(response.body.texto);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}