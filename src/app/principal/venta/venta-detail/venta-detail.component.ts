import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { VentaService } from '../venta.service';
import { VentaControlService } from '../venta-control.service';
import { Venta, VentaDetalle, Repuesto, Cliente } from '@models/entity';
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
  displayedColumns: string[] = ['codigo', 'descripcion', 'stock', 'precio', 'total', 'notas', 'accion'];
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
          repuesto.precio = detalle.precio;
          repuesto.notas = detalle.notas;
          repuesto.descripcion = this._toDescripcion(detalle.repuesto);
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
          temp.stock = repuesto ? result.stock : temp.stock + result.stock;
          temp.precio = result.precio;
          temp.notas = result.notas;
        } else {
          this.data = [result].concat(this.data);
        }
        this._calcular();
      }
    });
  }

  clear() {
    this.data = [];
    this._calcular();
    this.formView.resetForm();
    this.form.get('id').setValue(this.id ? this.id : this.control.generateId());
  }

  delete(repuesto: Repuesto) {
    this.data = this.data.filter(r => r.id != repuesto.id)
    this._calcular();
  }

  guardar() {
    if(this.form.valid && this.data.length > 0) {
      const data = { mensaje: "¿Desea guardar la venta?", accion: "Continuar" };
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        width: '360px', autoFocus: false, disableClose: true, data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          const venta: Venta = this.form.getRawValue();
          venta.ventaDetalle = this._toVentaDetalle(this.data);
          venta.fecha = moment(venta.fecha).format('YYYY-MM-DD');
          venta.usuarioIngreso = this.auth.nombreUsuario;
          venta.usuarioModificacion = this.auth.nombreUsuario;
          this.service.insertOrUpdate(venta).subscribe(response => {
            if(response?.status == 200) {
              this.sharedService.showMessage(response.body.texto);
              if(!this.id) this.clear();
            }
          });
        }
      });
    } else {
      this.sharedService.showErrorMessage('Venta inválida');
    }
  }

  private _toVentaDetalle(repuestos: Repuesto[]): VentaDetalle[] {
    let ventaDetalle: VentaDetalle[] = [];
    for(let repuesto of repuestos) {
      ventaDetalle.push({ repuestoId: repuesto.id, cantidad: repuesto.stock, 
        precio: repuesto.precio, notas: repuesto.notas });
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

  private _toDescripcion(repuesto: Repuesto): string {
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