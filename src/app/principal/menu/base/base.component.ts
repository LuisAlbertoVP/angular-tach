import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { listModulos } from '@models/menu';
import { Modulo } from '@models/menu';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  modulos: Modulo[] = [];

  constructor(
    private router: Router,
    sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Menú principal' });
  }

  ngOnInit(): void {
    this.modulos = JSON.parse(JSON.stringify(listModulos));
  }

  navigate = (modulo: Modulo) => this.router.navigate([modulo.ruta]).then(() => modulo.checked = false);
}