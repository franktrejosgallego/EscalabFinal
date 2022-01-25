//https://desystemsoft.com:80s80

export const VALIDARUSUARIOURL = 'http://localhost:8080/api/login';
export const REALIZARCAMBIOCLAVE = 'http://localhost:8080/api/changePassword';
export const SOLICITARCAMBIOCLAVE = 'http://localhost:8080/api/requestChangePassword';
export const REALIZARCAMBIOCLAVELOCAL = 'http://localhost:8080/api/changeoldpassword';
export const CLIENTE5NIT = 'http://localhost:8080/api/cliente5nit';
export const CLIENTE5RS = 'http://localhost:8080/api/cliente5rs';
export const PROCDUCTONOM = 'http://localhost:8080/api/productonom';
export const PRODUCTO5COD = 'http://localhost:8080/api/producto5cod';
export const PRODUCTOCOD = 'http://localhost:8080/api/productocod';
export const CREARPEDIDO = 'http://localhost:8080/api/pedido/crear';
export const RUTAIMAGENES = 'http://localhost:8080/images/';
export const INSERTARPRODUCTO = 'http://localhost:8080/api/pedido/insertar';
export const BUSCARPENDIENTE = 'http://localhost:8080/api/pedido/BuscarPendiente';
export const ELIMINARPRODUCTO = 'http://localhost:8080/api/pedido/EliminarProducto';
export const CANCELARPEDIDO = 'http://localhost:8080/api/pedido/cancelarPedido';
export const LISTAFACTURAS = 'http://localhost:8080/api/pedido/listaFacturas';

export const RESULTS = {
    OK: 0,
    ERROR: 1,
    TOKENINVALID: 2,
    TOKENEXPIRED: 3,
    NOTOKEN: 4,
    CHANGEPASSWORD: 5,
    PASSWORDINVALID: 6,
    USERINVALID: 7,
    JSONINVALID: 8,
    NOEMAIL: 9,
    INVALIDCODE: 10,
    REPITED: 11,
    NOAFECTED: 12
};

export const MENSAJES = {
    SUSSES: 1,
    ERROR: 2,
    WARN: 3
};

export const LS_USER = '';

export const CONFIG = {
    DIAS_PEDIDO: 30
};
