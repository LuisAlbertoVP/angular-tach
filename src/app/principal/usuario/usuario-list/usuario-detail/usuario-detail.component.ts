import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { UsuarioControlService } from '../../usuario-control.service';
import { UsuarioService } from '../../usuario.service';
import { User, Rol } from '@models/entity';

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

  guardar(roles: Rol[] = []) {
    if(this.form.valid) {
      const usuario = this.form.getRawValue();
      for(let i = 0; i < usuario.roles.length; i++) {
        roles.push({ id: (usuario.roles[i] as string), descripcion: ''});
      }
      usuario.roles = roles;
      usuario.fechaNacimiento = this.sharedService.parseDbDate(usuario.fechaNacimiento);
      usuario.fechaContratacion = this.sharedService.parseDbDate(usuario.fechaContratacion);
      usuario.clave = usuario.clave ? usuario.clave : '';
      usuario.usuarioIngreso = this.auth.nombreUsuario;
      usuario.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(usuario).subscribe(response => {
        if(response?.status == 200) {
          if(usuario.id == this.auth.id) {
            this.auth.nombres = usuario.nombres;
            this.auth.nombreUsuario = usuario.nombreUsuario;
          }
          this.sharedService.showMessage(response.body.texto);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}