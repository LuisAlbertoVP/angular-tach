import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@auth_service/*';
import { CuentaService } from '../cuenta.service';
import { CuentaControlService } from '../cuenta-control.service';
import { SharedService } from '@shared/shared.service';
import { User } from '@models/entity';
import * as moment from 'moment';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html',
  styles: ['.pl { padding-left: 50px; }']
})
export class CuentaDetailComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  id: string = this.auth.id;

  constructor(
    private auth: AuthService,
    private control: CuentaControlService,
    private service: CuentaService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Perfil' });
  }

  ngOnInit(): void {
    this.service.getById(this.id).subscribe(usuario => {
      this.form = this.control.toFormGroup(usuario);
    });
  }

  guardar() {
    if(this.form.valid) {
      const usuario: User = this.form.getRawValue();
      usuario.id = this.id;
      usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format('YYYY-MM-DD');
      usuario.clave = usuario.clave ? usuario.clave : '';
      usuario.usuarioModificacion = this.auth.nombreUsuario;
      this.service.update(usuario).subscribe(response => {
        if(response?.status == 200) {
          this.sharedService.showMessage(response.body.texto);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}