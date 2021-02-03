import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth_service/*';
import { User } from '@models/entity';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CuentaComponent } from './cuenta/cuenta.component';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = this.fb.group({
    nombreUsuario: ['', Validators.required],
    clave: ['', Validators.required]
  });
  hide: boolean = true;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService,
  ) {}

  login(): void {
    if(this.form.valid) {
      const user: User = this.form.getRawValue();
      user.clave = SHA256(user.clave).toString();
      this.service.login(user).subscribe((response: HttpResponse<User>) => {
        if(response.status == 200) {
          this.service.saveToken(response.body);
          this.router.navigate(['/principal']);
        }
      });
    }
  }

  openForm = () => this.dialog.open(CuentaComponent, {width: '720px'});
}