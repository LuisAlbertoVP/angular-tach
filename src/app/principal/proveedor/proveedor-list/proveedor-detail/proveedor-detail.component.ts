import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { ProveedorControlService } from '../../proveedor-control.service';
import { ProveedorService } from '../../proveedor.service';
import { SharedService } from '@shared/shared.service';
import { Proveedor } from '@models/entity';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-proveedor-detail',
  templateUrl: './proveedor-detail.component.html'
})
export class ProveedorDetailComponent implements OnInit {
  form: FormGroup = null;
  isMobile: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public proveedor: Proveedor,
    private auth: AuthService,
    private control: ProveedorControlService,
    private dialogRef: MatDialogRef<ProveedorDetailComponent>,
    private service: ProveedorService,
    private sharedService: SharedService
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.control.toFormGroup(this.proveedor);
  }

  guardar() {
    if(this.form.valid) {
      const proveedor: Proveedor = this.form.getRawValue();
      proveedor.id = this.proveedor ? proveedor.id : uuid();
      proveedor.usuarioIngreso = this.auth.nombreUsuario;
      proveedor.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(proveedor).subscribe((response: HttpResponse<any>) => {
        if(response.status == 200) {
          this.sharedService.showMessage(response.body.result);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son invalidos');
    }
  }
}