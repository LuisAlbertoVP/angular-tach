import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '@auth_service/*';
import { CuentaService } from '../cuenta.service';
import { SharedService } from '@shared/shared.service';
import { User } from '@models/entity';
import { SHA256 } from 'crypto-js';
import * as moment from 'moment';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html'
})
export class CuentaDetailComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  id: string = this.auth.id;
  isMobile: boolean = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private service: CuentaService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Cuenta' });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.service.getById(this.id).subscribe(usuario => {
      this.form = this.fb.group({
        nombres: [usuario?.nombres, Validators.required],
        cedula: [usuario?.cedula, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        correo: [usuario?.correo,[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        direccion: [usuario?.direccion, Validators.required],
        telefono: [usuario?.telefono, Validators.required],
        celular: [usuario?.celular, Validators.required],
        fechaNacimiento: [usuario?.fechaNacimiento, Validators.required],
        nombreUsuario: [usuario?.nombreUsuario, Validators.required],
        clave: [usuario?.clave, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]
      });
    });
  }

  guardar() {
    if(this.form.valid) {
      const usuario: User = this.form.getRawValue();
      usuario.id = this.id;
      usuario.usuarioModificacion = this.auth.nombreUsuario;
      usuario.fechaNacimiento = moment(usuario.fechaNacimiento).format('YYYY-MM-DD');
      usuario.clave = usuario.clave ? SHA256(usuario.clave).toString() : '';
      this.service.update(usuario).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.sharedService.showMessage(response.body.result);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}