import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { listModulos } from '@models/modulos';
import { Modulo } from '@models/auth';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  modulos: Modulo[] = listModulos;

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  navigate = (url: string) => this.router.navigate([url]);
}