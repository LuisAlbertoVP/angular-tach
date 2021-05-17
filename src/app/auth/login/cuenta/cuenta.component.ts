import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth_service/*';
import { AuthControlService } from '../../auth-control.service';
import { User } from '@models/entity';
import * as moment from 'moment';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styles: ['.cuenta-screen > *:not(:last-child) { width: 100%; margin-top: 2px; margin-bottom: 2px; }']
})
export class CuentaComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  isMobile: boolean = false;

  constructor(
    breakpointObserver: BreakpointObserver,
    private control: AuthControlService,
    private dialogRef: MatDialogRef<CuentaComponent>,
    public service: AuthService,
    private snackBar: MatSnackBar
  ) { 
    breakpointObserver.observe([
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  ngOnInit(): void {
    this.form = this.control.toCuentaForm();
  }

  crear() {
    if(this.form.valid) {
      const user: User = this.form.getRawValue();
      user.usuarioIngreso = user.nombreUsuario;
      user.fechaNacimiento = moment(user.fechaNacimiento).format('YYYY-MM-DD');
      this.service.addAccount(user).subscribe(response => {
        if(response?.status == 200) {
          this.snackBar.open(response.body.texto, 'Ok', {duration: 6000, panelClass: ['success']});
          this.dialogRef.close();
        }
      });
    } else {
      this.snackBar.open('Algunos campos son inválidos', 'Error', {duration: 2000});
    }
  }
}