import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '@shared/shared.service';
import { AuthService } from '@auth_service/*';
import { Compra, CompraDetalle, Repuesto } from '@models/entity';
import { CompraService } from '../compra.service';
import { ConfirmacionComponent } from '@shared/transaccion-shared/confirmacion/confirmacion.component';
import { RepuestoSearchComponent } from '@shared/transaccion-shared/repuesto-search/repuesto-search.component';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-compra-detail',
  templateUrl: './compra-detail.component.html',
  styleUrls: ['./compra-detail.component.css']
})
export class CompraDetailComponent {
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
    private service: CompraService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {
    sharedService.buildMenuBar({ title: 'Compra' });
  }

  openBusqueda(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoSearchComponent, {
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
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: "¿Desea guardar la compra?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(this.data.length > 0) {
          let date: string = moment(this.fecha.value).format('YYYY-MM-DD');
          let time: string = '00:00:00';
          if(date == moment().format('YYYY-MM-DD')) {
            time = moment().format('HH:mm:ss');
          }
          const compra: Compra = { 
            id: uuid(), compraDetalle: this.buildCompraDetalle(), cantidad: this.cantidad, total: this.total, 
            descripcion: this.descripcion.value, usuarioIngreso: this.auth.nombreUsuario, 
            fechaIngreso: moment(date + ' ' + time).format()
          };
          this.service.insertOrUpdate(compra).subscribe((response: HttpResponse<any>) => {
            if(response.status == 200) {
              this.sharedService.showMessage(response.body.result);
              this.clear();
            }
          });
        } else {
          this.snackBar.open('Lista de compras vacía', 'Error', {duration: 2000});
        }
      }
    });
  }

  private buildCompraDetalle() {
    let compraDetalle: CompraDetalle[] = [];
    for(let repuesto of this.data) {
      compraDetalle.push({ repuestoId: repuesto.id, cantidad: repuesto.stock });
    }
    return compraDetalle;
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
}