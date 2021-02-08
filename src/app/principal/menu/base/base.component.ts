import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { listModulos } from '@models/menu';
import { Modulo } from '@models/menu';
import { AuthService } from '@auth_service/*';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  modulos: Modulo[] = [];

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.modulos = JSON.parse(JSON.stringify(listModulos));
  }

  navigate = (url: string) => this.router.navigate([url]);
}