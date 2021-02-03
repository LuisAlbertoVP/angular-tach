import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@shared_service/shared';
import { AuthService } from '@auth_service/*';
import { Repuesto, Venta } from '@models/entity';
import { VentaService } from '../venta.service';
import { RepuestoVentaComponent } from './repuesto-venta/repuesto-venta.component';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-venta-detail',
  templateUrl: './venta-detail.component.html',
  styleUrls: ['./venta-detail.component.css']
})
export class VentaDetailComponent {
  cantidad: number = 0;
  displayedColumns: string[] = ['codigo', 'descripcion', 'stock', 'precio', 'total', 'accion'];
  data: Repuesto[] = [];
  descripcion = this.fb.control('');
  fecha = this.fb.control(moment().toDate(), Validators.required);
  total: number = 0;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: VentaService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    sharedService.buildMenuBar({ title: 'Venta' });
  }

  openBusqueda(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoVentaComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: repuesto
    });
    dialogRef.afterClosed().subscribe((result: Repuesto) => {
      if(result) {
        const temp: Repuesto = this.hasRepuesto(result.id);
        if(temp != null) {
          temp.stock = result.stock;
          temp.precio = result.precio;
          this.calcular();
        } else {
          this.data = this.data.concat([result]);
          this.calcular();
        }
      }
    });
  }

  clear() {
    this.data = [];
    this.cantidad = 0;
    this.total = 0;
    this.fecha.patchValue(moment().toDate());
    this.descripcion.patchValue('');
  }

  delete(repuesto: Repuesto) {
    this.data = this.data.filter(r => r.id != repuesto.id)
    this.calcular();
  }

  guardar() {
    const dialogRef = this.dialog.open(DialogConfirm, {
      width: '360px', autoFocus: false, disableClose: true, data: "¿Desea guardar la venta?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(this.data.length > 0) {
          const venta: Venta = { 
            id: uuid(), repuestos: this.mimifiedRepuestos(), cantidad: this.cantidad, total: this.total, 
            descripcion: this.descripcion.value, usuarioIngreso: this.auth.nombreUsuario, 
            fechaIngreso: moment(this.fecha.value).format('YYYY-MM-DD')
          };
          this.service.insertOrUpdate(venta).subscribe((response: HttpResponse<any>) => {
            if(response.status == 200) {
              this.sharedService.showMessage(response.body.result);
              this.clear();
            }
          });
        } else {
          this.snackBar.open('Lista de repuestos vacía', 'Error', {duration: 2000});
        }
      }
    });
  }

  private calcular() {
    let cantidad = 0, total = 0;
    for(let repuesto of this.data) {
      cantidad += repuesto.stock;
      total += (repuesto.stock * repuesto.precio);
    }
    this.cantidad = cantidad;
    this.total = total;
  }

  private hasRepuesto(id: string): Repuesto {
    for(let repuesto of this.data) {
      if(repuesto.id == id) {
        return repuesto;
      }
    }
    return null;
  }

  private mimifiedRepuestos() {
    let repuestos: Repuesto[] = [];
    for(let repuesto of this.data) {
      repuestos.push({ id: repuesto.id, stock: repuesto.stock });
    }
    return repuestos;
  }
}

@Component({
  selector: 'dialog-confirm',
  template: `
    <div>
      <h2 mat-dialog-title>Mensaje</h2>
      <mat-dialog-content class="mat-typography">
        <p>{{ mensaje }}</p>
      </mat-dialog-content>
      <mat-dialog-actions class="d-flex justify-content-around">
        <button mat-stroked-button mat-dialog-close>Cancelar</button>
        <button mat-stroked-button color="primary" [mat-dialog-close]="true">Continuar</button>
      </mat-dialog-actions>
    </div>
  `
})
export class DialogConfirm {
  constructor(@Inject(MAT_DIALOG_DATA) public mensaje: string) {}
}