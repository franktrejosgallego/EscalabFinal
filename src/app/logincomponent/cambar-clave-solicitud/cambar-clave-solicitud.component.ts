import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../global/auth/auth.service';
import { MENSAJES, RESULTS } from 'src/app/global/Constantes';

@Component({
  selector: 'app-cambar-clave-solicitud',
  templateUrl: './cambar-clave-solicitud.component.html',
  styleUrls: ['../login.component.scss']
})
export class CambarClaveSolicitudComponent implements OnInit {
  ccform: FormGroup;
  strboton: String;
  primerIntento = false;
  private formSubmitAttempt: boolean;

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private router: Router,
    private autservice: AuthService) { }

  ngOnInit() {
    this.strboton = 'CAMBIAR CONTRASEÑA';
    this.ccform = this.fb.group({
      user: ['', Validators.required],
      vendedor: [true]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.ccform.get(field).valid && this.ccform.get(field).touched) ||
      (this.ccform.get(field).untouched && this.formSubmitAttempt)
    );
  }

  async onSubmit() {
    try {
      if (this.ccform.valid) {
        const ret = await this.service.SolicitarCambioClave(this.ccform.value);
        if (ret) {
          if (ret.resultCode === RESULTS.OK) {
            let usuario: any = {};
            usuario.usuario = this.ccform.value.user;
            usuario.vendedor = this.ccform.value.vendedor;
            this.autservice.usuario = usuario;
            this.router.navigate(['/setearclave']); 
          } else if (ret.resultCode === RESULTS.USERINVALID) {
            this.autservice.mostrarMensaje('no se encontro el usuario, intentelo de nuevo', MENSAJES.ERROR);
          } else if (ret.resultCode === RESULTS.NOEMAIL) {
            this.autservice.mostrarMensaje('El usuario no tiene un correo, comuniquese con la linea de atencion al cliente', MENSAJES.ERROR);
          }
        }
        this.formSubmitAttempt = true;
      }
    } catch (ex) {
      this.autservice.mostrarMensaje('no se pudo comunicar con el servidor, intentelo de nuevo', MENSAJES.ERROR);
      console.error(ex);
    }
  }
}
