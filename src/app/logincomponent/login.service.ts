import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// tslint:disable-next-line:max-line-length
import {
  VALIDARUSUARIOURL,
  SOLICITARCAMBIOCLAVE,
  REALIZARCAMBIOCLAVELOCAL,
  REALIZARCAMBIOCLAVE
} from '../global/Constantes';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  async GetUser(params: any): Promise<any> {
    return this.http.post(VALIDARUSUARIOURL, params).toPromise();
  }

  async SolicitarCambioClave(data: string): Promise<any> {
    return this.http.post(SOLICITARCAMBIOCLAVE, data).toPromise();
  }

  async RealizarCambioClave(data): Promise<any> {
    return this.http.post(REALIZARCAMBIOCLAVE, data).toPromise();
  }

  async RealizarCambioClaveLocal(data): Promise<any> {
    return this.http.post(REALIZARCAMBIOCLAVELOCAL, data).toPromise();
  }

}
