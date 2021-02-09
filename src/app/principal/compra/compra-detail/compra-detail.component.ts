import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { CompraService } from '../compra.service';
import { SharedService } from '@shared/shared.service';
import { Compra, CompraDetalle, Repuesto } from '@models/entity';
import { ConfirmationData } from '@models/confirmacion';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { RepuestoSearchComponent } from '@shared/repuesto-search/repuesto-search.component';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

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
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Compra' });
  }

  openBusqueda(repuesto?: Repuesto) {
    const dialogRef = this.dialog.open(RepuestoSearchComponent, {
      width: '720px', autoFocus: false, disableClose: true, data: repuesto
    });
    dialogRef.afterClosed().subscribe((result: Repuesto) => {
      if(result) {
        const temp: Repuesto = this._hasRepuesto(result.id);
        if(temp != null) {
          temp.stock = result.stock;
          temp.precio = result.precio;
          this._calcular();
        } else {
          this.data = [result].concat(this.data);
          this._calcular();
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
    this._calcular();
  }

  guardar() {
    const data: ConfirmationData = { seccion: "Compras", accion: "Continuar" };
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '360px', autoFocus: false, disableClose: true, data: data
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
            id: uuid(), compraDetalle: this._buildCompraDetalle(), cantidad: this.cantidad, total: this.total, 
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
          this.sharedService.showErrorMessage('Lista de compras vacía');
        }
      }
    });
  }

  private _buildCompraDetalle() {
    let compraDetalle: CompraDetalle[] = [];
    for(let repuesto of this.data) {
      compraDetalle.push({ repuestoId: repuesto.id, cantidad: repuesto.stock });
    }
    return compraDetalle;
  }

  private _calcular() {
    let cantidad = 0, total = 0;
    for(let repuesto of this.data) {
      cantidad += repuesto.stock;
      total += (repuesto.stock * repuesto.precio);
    }
    this.cantidad = cantidad;
    this.total = total;
  }

  private _hasRepuesto(id: string): Repuesto {
    for(let repuesto of this.data) {
      if(repuesto.id == id) {
        return repuesto;
      }
    }
    return null;
  }
}