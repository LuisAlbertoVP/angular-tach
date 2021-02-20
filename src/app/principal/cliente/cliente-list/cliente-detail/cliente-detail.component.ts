import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { ClienteService } from '../../cliente.service';
import { Cliente } from '@models/entity';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html'
})
export class ClienteDetailComponent implements OnInit {
  form: FormGroup = null;
  hide: boolean = true;
  isMobile: boolean = false;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public cliente: Cliente,
    private auth: AuthService,
    private dialogRef: MatDialogRef<ClienteDetailComponent>,
    private fb: FormBuilder,
    private service: ClienteService,
    private sharedService: SharedService
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.cliente?.id],
      nombres: [this.cliente?.nombres, Validators.required],
      cedula: [this.cliente?.cedula, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: [this.cliente?.correo,[ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      direccion: [this.cliente?.direccion, Validators.required],
      telefono: [this.cliente?.telefono, Validators.required],
      celular: [this.cliente?.celular, Validators.required],
      fechaNacimiento: [this.cliente?.fechaNacimiento, Validators.required],
      tipoCliente: [this.cliente?.tipoCliente ? this.cliente.tipoCliente : 'Cliente', Validators.required]
    });
  }

  guardar() {
    if(this.form.valid) {
      const cliente = this.form.getRawValue();
      cliente.id = this.cliente ? cliente.id : uuid();
      cliente.usuarioIngreso = this.auth.nombreUsuario;
      cliente.usuarioModificacion = this.auth.nombreUsuario;
      cliente.fechaNacimiento = moment(cliente.fechaNacimiento).format('YYYY-MM-DD');
      this.service.insertOrUpdate(cliente).subscribe((response: HttpResponse<any>) => {
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