import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { VentaService } from '../venta.service';
import { VentaControlService } from '../venta-control.service';
import { Venta, VentaDetalle, Repuesto, Cliente } from '@models/entity';
import { ConfirmationData } from '@models/confirmacion';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { RepuestoSearchComponent } from '@shared/repuesto-search/repuesto-search.component';
import * as moment from 'moment';

@Component({
  selector: 'app-venta-detail',
  templateUrl: './venta-detail.component.html',
  styleUrls: ['./venta-detail.component.css']
})
export class VentaDetailComponent implements OnInit {
  @ViewChild('formView') formView: NgForm;
  cantidad: number = 0;
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['codigo', 'descripcion', 'stock', 'precio', 'total', 'accion'];
  data: Repuesto[] = [];
  form: FormGroup = null;
  id: string = '';
  total: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private auth: AuthService,
    private control: VentaControlService,
    private dialog: MatDialog,
    private service: VentaService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Venta' });
  }

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.paramMap.get('id');
    this.service.getForm(this.id).subscribe(ventaForm => {
      const venta: Venta = ventaForm?.venta;
      if(venta) {
        this.data = venta.ventaDetalle.map(detalle => {
          const repuesto: Repuesto = detalle.repuesto;
          repuesto.stock = detalle.cantidad;
          repuesto.descripcion = this._descripcion(detalle.repuesto);
          return repuesto;
        });
        this._calcular();
      }
      this.clientes = ventaForm.clientes;
      this.form = this.control.toFormGroup(venta);
    });
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
    this.formView.resetForm();
    this.form.get('id').setValue(this.id ? this.id : this.control.generateId());
  }

  delete(repuesto: Repuesto) {
    this.data = this.data.filter(r => r.id != repuesto.id)
    this._calcular();
  }

  guardar() {
    if(this.form.valid && this.data.length > 0) {
      const data: ConfirmationData = { seccion: "Ventas", accion: "Continuar" };
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        width: '360px', autoFocus: false, disableClose: true, data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          const venta: Venta = this.form.getRawValue();
          venta.ventaDetalle = this._buildVentaDetalle();
          venta.cantidad = this.cantidad;
          venta.total = this.total;
          venta.fecha = moment(venta.fecha).format('YYYY-MM-DD');
          venta.usuarioIngreso = this.auth.nombreUsuario;
          venta.usuarioModificacion = this.auth.nombreUsuario;
          this.service.insertOrUpdate(venta).subscribe(response => {
            if(response?.status == 200) {
              this.sharedService.showMessage(response.body.result);
              if(!this.id) this.clear();
            }
          });
        }
      });
    } else {
      this.sharedService.showErrorMessage('Venta inválida');
    }
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

  private _descripcion(repuesto: Repuesto) {
    return repuesto.categoria.descripcion + ' ' + repuesto.marca.descripcion + ' ' +
      repuesto.modelo + ' ' + repuesto.epoca;
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