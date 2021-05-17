import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@auth_service/*';
import { AuthControlService } from '../auth-control.service';
import { CuentaComponent } from './cuenta/cuenta.component';
import { User } from '@models/entity';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  isLoading: boolean = false;

  constructor(
    private control: AuthControlService,
    private dialog: MatDialog,
    private router: Router,
    private service: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.control.toLoginForm();
  }

  login() {
    if(this.form.valid) {
      this.isLoading = true;
      const user: User = this.form.getRawValue();
      this.service.login(user).subscribe(response => {
        this.isLoading = false;
        if(response?.status == 200) {
          this.service.saveToken(response.body);
          this.router.navigate(['/principal']);
        }
      });
    }
  }

  openForm = () => this.dialog.open(CuentaComponent, {width: '720px'});
}