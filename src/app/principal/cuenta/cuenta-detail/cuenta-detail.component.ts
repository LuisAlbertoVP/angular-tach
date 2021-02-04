import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '@models/entity';
import { SharedService } from '@shared/shared.service';
import { AuthService } from '@auth_service/*';
import { CuentaService } from '../cuenta.service';
import { SHA256 } from 'crypto-js';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-cuenta-detail',
  templateUrl: './cuenta-detail.component.html'
})
export class CuentaDetailComponent implements OnInit {
  form = this.fb.group({
    nombreUsuario: ['', Validators.required],
    nombres: ['', Validators.required],
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    correo: ['',[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    celular: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    clave: ['', Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]
  });
  hide: boolean = true;
  id: string = this.auth.id;
  isMobile: boolean = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private service: CuentaService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    sharedService.buildMenuBar({ title: 'Cuenta' });
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.service.getById(this.id).subscribe(usuario => this.form.patchValue(usuario));
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
      this.snackBar.open('Algunos campos son invalidos', 'Error', {duration: 2000});
    }
  }
}