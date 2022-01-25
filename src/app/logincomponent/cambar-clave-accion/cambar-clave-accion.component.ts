import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { AuthService } from '../../global/auth/auth.service';
import { Router } from '@angular/router';
import { RESULTS, MENSAJES } from 'src/app/global/Constantes';
// tslint:disable:triple-equals
@Component({
  selector: 'app-cambar-clave-accion',
  templateUrl: './cambar-clave-accion.component.html',
  styleUrls: ['../login.component.scss']
})
export class CambarClaveAccionComponent implements OnInit {
  form: FormGroup;
  public usuarioNuevo = false;
  private formSubmitAttempt: boolean;

  constructor(private fb: FormBuilder,
              private service: LoginService,
              private autservice: AuthService,
              private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      elcodigo: [''],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });

    //se valida si es cambio por clave nueva o por solicitud
    if (this.autservice.usuario.nuevo) {
      this.usuarioNuevo = true;
    } else {
      this.usuarioNuevo = false;
      const elcod = this.form.get('elcodigo');
      elcod.setValidators([Validators.required]);
      // elcod.updateValueAndValidity();
    }
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  async onSubmit() {
    if (this.form.valid) {
      if (this.form.value.password !== this.form.value.password2) {
        this.autservice.mostrarMensaje('Las contraseñas no coinciden', MENSAJES.ERROR);
        this.form.value.password = this.form.value.password2 = '';
      } else if (this.form.value.password.len <= 6) {
        this.autservice.mostrarMensaje('La contraseña debe tener minimo 6 caracteres', MENSAJES.ERROR);
        this.form.value.password = this.form.value.password2 = '';
      } else {
        const data: any = {
          user: this.autservice.usuario.usuario,
          newPassword: this.form.value.password,
          vendedor: this.autservice.usuario.vendedor,
          codigo: this.form.value.elcodigo
        };

        const ret = await this.service.RealizarCambioClave(data);
        if (ret) {
          if (ret.resultCode == RESULTS.OK) {
            this.autservice.mostrarMensaje('Se cambio la clave correctamente', MENSAJES.SUSSES);
            this.router.navigate(['/login']);
          } else if (ret.resultCode == RESULTS.USERINVALID) {
            this.autservice.mostrarMensaje('Usuario invalido', MENSAJES.ERROR);
          } else if (ret.resultCode == RESULTS.INVALIDCODE) {
            this.autservice.mostrarMensaje('El codigo no coincide, comience el proceso de nuevo', MENSAJES.ERROR);
          } else {
            this.autservice.mostrarMensaje('Respuesta invalida del servidor', MENSAJES.ERROR);
          }
        }
      }
    }
    this.formSubmitAttempt = true;
  }
}
