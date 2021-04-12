import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { CompraService } from '../compra.service';
import { CompraControlService } from '../compra-control.service';
import { SharedService } from '@shared/shared.service';
import { Compra, CompraDetalle, Proveedor, Repuesto } from '@models/entity';
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
  file: File = null;
  form: FormGroup = null;
  id: string = '';
  nombreArchivo: string = '';
  proveedores: Proveedor[] = [];
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
      this.proveedores = compraForm.proveedores;
      this.form = this.control.toFormGroup(compra);
      this.nombreArchivo = compra?.ruta;
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
    this.nombreArchivo = '';
    this.formView.resetForm();
    this.form.get('id').setValue(this.id ? this.id : this.control.generateId());
  }

  delete(repuesto: Repuesto) {
    this.data = this.data.filter(r => r.id != repuesto.id)
    this._calcular();
  }

  deleteFile(id: string) {
    this.service.deleteFile(id).subscribe(response => {
      if(response.status == 200) {
        this.nombreArchivo = '';
        this.form.get('ruta').setValue(this.nombreArchivo);
        this.sharedService.showMessage(response.body.result);
      }
    });
  }

  downloadFile(id: string) {
    this.service.downloadFile(id).subscribe(response => {
      if(response?.size) {
        let url = window.URL.createObjectURL(response);
        window.open(url);
      } else {
        this.sharedService.showErrorMessage('El archivo no existe');
      }
    });
  }

  guardar() {
    if(this.form.valid && this.data.length > 0) {
      const data = { mensaje: "¿Desea guardar la compra?", accion: "Continuar" };
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        width: '360px', autoFocus: false, disableClose: true, data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) this.guardarCompra();
      });
    } else {
      this.sharedService.showErrorMessage('Compra inválida');
    }
  }

  guardarCompra() {
    this.form.get('ruta').setValue(this.nombreArchivo);
    const compra: Compra = this.form.getRawValue();
    compra.compraDetalle = this._toCompraDetalle(this.data);
    compra.fecha = moment(compra.fecha).format('YYYY-MM-DD');
    compra.usuarioIngreso = this.auth.nombreUsuario;
    compra.usuarioModificacion = this.auth.nombreUsuario;
    const formData: FormData = new FormData();
    if(this.file) formData.append('file', this.file, this.file.name);
    this.service.insertOrUpdate(formData, compra).subscribe(responses => {
      let band: boolean = true;
      for(let i = 0; i < responses.length; i++) {
        if(responses[i].status != 200) band = false;
      }
      if(band) {
        this.sharedService.showMessage("Compra actualizada correctamente");
        if(!this.id) this.clear();
        this.file = null;
      }
    });
  }

  selectFile(files: FileList) {
    if(files.length > 0) {
      this.file = files[0];
      this.nombreArchivo = this.file.name;
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