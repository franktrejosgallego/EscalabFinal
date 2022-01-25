import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CLIENTE5NIT,
  CLIENTE5RS,
  PROCDUCTONOM,
  CREARPEDIDO,
  PRODUCTOCOD,
  INSERTARPRODUCTO,
  BUSCARPENDIENTE,
  ELIMINARPRODUCTO,
  CANCELARPEDIDO,
  LISTAFACTURAS
} from '../global/Constantes';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  constructor(private http: HttpClient) { }

  async cliente5nit(params: any): Promise<any> {
    return this.http.post(CLIENTE5NIT, params).toPromise();
  }

  async cliente5rs(params: any): Promise<any> {
    return this.http.post(CLIENTE5RS, params).toPromise();
  }

  async productonom(params: any): Promise<any> {
    return this.http.post(PROCDUCTONOM, params).toPromise();
  }

  async CrearPedido(params: any): Promise<any> {
    return this.http.post(CREARPEDIDO, params).toPromise();
  }

  async insertarProducto(params: any): Promise<any> {
    return this.http.post(INSERTARPRODUCTO, params).toPromise();
  }

  async productocod(params: any): Promise<any> {
    return this.http.post(PRODUCTOCOD, params).toPromise();
  }

  async BuscarPendiente(params: any): Promise<any> {
    return this.http.post(BUSCARPENDIENTE, params).toPromise();
  }

  async EliminarProducto(params: any): Promise<any> {
    return this.http.post(ELIMINARPRODUCTO, params).toPromise();
  }

  async cancelarPedido(params: any): Promise<any> {
    return this.http.post(CANCELARPEDIDO, params).toPromise();
  }

  async GetFacuras(params: any): Promise<any> {
    return this.http.post(LISTAFACTURAS, params).toPromise();
  }  
}
