import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { VentaService } from '../venta.service';
import { Venta, VentaDetalle, Repuesto } from '@models/entity';
import { ConfirmationData } from '@models/confirmacion';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { RepuestoSearchComponent } from '@shared/repuesto-search/repuesto-search.component';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

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
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Venta' });
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
    const data: ConfirmationData = { seccion: "Ventas", accion: "Continuar" };
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
          const venta: Venta = { 
            id: uuid(), ventaDetalle: this._buildVentaDetalle(), cantidad: this.cantidad, total: this.total, 
            descripcion: this.descripcion.value, usuarioIngreso: this.auth.nombreUsuario, 
            fechaIngreso: moment(date + ' ' + time).format()
          };
          this.service.insertOrUpdate(venta).subscribe((response: HttpResponse<any>) => {
            if(response.status == 200) {
              this.sharedService.showMessage(response.body.result);
              this.clear();
            }
          });
        } else {
          this.sharedService.showErrorMessage('Lista de ventas vacía');
        }
      }
    });
  }

  private _buildVentaDetalle() {
    let ventaDetalle: VentaDetalle[] = [];
    for(let repuesto of this.data) {
      ventaDetalle.push({ repuestoId: repuesto.id, cantidad: repuesto.stock });
    }
    return ventaDetalle;
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