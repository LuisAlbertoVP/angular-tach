import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '@auth_service/*';
import { User } from '@models/auth';
import { HttpResponse } from '@angular/common/http';
import { SHA256 } from 'crypto-js';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styles: ['.cuenta-screen > *:not(:last-child) { width: 100%; margin-top: 2px; margin-bottom: 2px; }']
})
export class CuentaComponent implements OnInit {
  @ViewChild('close', { read: ElementRef }) button: ElementRef;
  hide: boolean = true;
  isMobile: boolean = false;
  form = this.fb.group({
    nombreUsuario: ['', Validators.required],
    nombres: ['', Validators.required],
    cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    correo: ['',[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
    celular: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    clave: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$')]]
  });

  constructor(
    breakpointObserver: BreakpointObserver,
    public service: AuthService,
    private fb: FormBuilder
  ) { 
    breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  ngOnInit(): void {
  }

  crear() {
    if(this.form.valid) {
      const user: User = this.form.value;
      user.id = uuid();
      user.usrIngreso = user.nombreUsuario;
      user.usrModificacion = user.nombreUsuario;
      user.clave = SHA256(user.clave).toString();
      user.estado = 0;
      this.service.addUser(user).subscribe((response: HttpResponse<Object>) => {
        if(response?.status == 200) {
          this.button.nativeElement.click();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}