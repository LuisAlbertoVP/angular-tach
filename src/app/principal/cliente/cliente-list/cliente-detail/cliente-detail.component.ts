import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '@auth_service/*';
import { SharedService } from '@shared/shared.service';
import { ClienteService } from '../../cliente.service';
import { ClienteControlService } from '../../cliente-control.service';
import { Cliente } from '@models/entity';
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
    private control: ClienteControlService,
    private dialogRef: MatDialogRef<ClienteDetailComponent>,
    private service: ClienteService,
    private sharedService: SharedService
  ) {
    sharedService.isMobile$.subscribe(isMobile => this.isMobile = isMobile);
  }

  ngOnInit(): void {
    this.form = this.control.toFormGroup(this.cliente);
  }

  guardar() {
    if(this.form.valid) {
      const cliente = this.form.getRawValue();
      cliente.fechaNacimiento = moment(cliente.fechaNacimiento).format('YYYY-MM-DD');
      cliente.usuarioIngreso = this.auth.nombreUsuario;
      cliente.usuarioModificacion = this.auth.nombreUsuario;
      this.service.insertOrUpdate(cliente).subscribe(response => {
        if(response?.status == 200) {
          this.sharedService.showMessage(response.body.texto);
          this.dialogRef.close(true);
        }
      });
    } else {
      this.sharedService.showErrorMessage('Algunos campos son inválidos');
    }
  }
}