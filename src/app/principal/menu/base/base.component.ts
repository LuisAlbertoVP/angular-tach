import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { listModulos } from '@models/menu';
import { Modulo } from '@models/menu';
import { AuthService } from '@auth_service/*';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
  modulos: Modulo[] = listModulos;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  navigate = (url: string) => this.router.navigate([url]);
}