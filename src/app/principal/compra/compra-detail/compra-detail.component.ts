import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { CompraService } from '../compra.service';
import { CompraControlService } from '../compra-control.service';
import { SharedService } from '@shared/shared.service';
import { Compra, CompraDetalle, Repuesto } from '@models/entity';
import { ConfirmationData } from '@models/confirmacion';
import { ConfirmacionComponent } from '@shared/confirmacion/confirmacion.component';
import { RepuestoSearchComponent } from '@shared/repuesto-search/repuesto-search.component';
import * as moment from 'moment';

@Component({
  selector: 'app-compra-detail',
  templateUrl: './compra-detail.component.html',
  styleUrls: ['./compra-detail.component.css']
})
export class CompraDetailComponent implements OnInit {
  @ViewChild('formView') formView: NgForm;
  cantidad: number = 0;
  displayedColumns: string[] = ['codigo', 'descripcion', 'stock', 'precio', 'total', 'accion'];
  data: Repuesto[] = [];
  form: FormGroup = null;
  id: string = '';
  total: number = 0;

  constructor(
    private activedRoute: ActivatedRoute,
    private auth: AuthService,
    private control: CompraControlService,
    private dialog: MatDialog,
    private service: CompraService,
    private sharedService: SharedService
  ) {
    sharedService.buildMenuBar({ title: 'Compra' });
  }

  ngOnInit(): void {
    this.id = this.activedRoute.snapshot.paramMap.get('id');
    this.service.getCompra(this.id).subscribe(compraForm => {
      const compra: Compra = compraForm?.compra;
      if(compra) {
        this.data = compra.compraDetalle.map(compraDetalle => {
          const repuesto: Repuesto = compraDetalle.repuesto;
          repuesto.stock = compraDetalle.cantidad;
          repuesto.descripcion = this._toDescripcion(compraDetalle.repuesto);
          return repuesto;
        });
        this._calcular();
      }
      this.form = this.control.toFormGroup(compra);
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
      const data: ConfirmationData = { seccion: "Compras", accion: "Continuar" };
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        width: '360px', autoFocus: false, disableClose: true, data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          const compra: Compra = this.form.getRawValue();
          compra.compraDetalle = this._toCompraDetalle(this.data);
          compra.fecha = moment(compra.fecha).format('YYYY-MM-DD');
          compra.usuarioIngreso = this.auth.nombreUsuario;
          compra.usuarioModificacion = this.auth.nombreUsuario;
          this.service.insertOrUpdate(compra).subscribe(response => {
            if(response?.status == 200) {
              this.sharedService.showMessage(response.body.result);
              if(!this.id) this.clear();
            }
          });
        }
      });
    } else {
      this.sharedService.showErrorMessage('Compra inválida');
    }
  }

  private _toCompraDetalle(repuestos: Repuesto[]): CompraDetalle[] {
    let compraDetalle: CompraDetalle[] = [];
    for(let repuesto of repuestos) {
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