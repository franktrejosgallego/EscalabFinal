import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
//import { Observable } from 'node_modules/rxjs/internal/Observable';
import { VALIDARUSUARIOURL, RESULTS, MENSAJES, REALIZARCAMBIOCLAVELOCAL, SOLICITARCAMBIOCLAVE } from "./Constantes";
import { tap, map } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { AuthService } from "./auth/auth.service";

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  private urlsSinToken = [VALIDARUSUARIOURL, SOLICITARCAMBIOCLAVE, REALIZARCAMBIOCLAVELOCAL];

  constructor(private authService: AuthService) { }


  intercept(httpReq: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let conToken = true;
    this.urlsSinToken.forEach(element => {
      if (httpReq.url.includes(element)) {
        conToken = false;
      }
    });

    if (conToken) {
      if (this.authService.usuario && this.authService.usuario.token) {
        // headers.set('Token', 'Bearer ' + this.token);
        httpReq = httpReq.clone({ headers: httpReq.headers.set('Authorization', 'Bearer ' + this.authService.usuario.token) });
      }
    }

    httpReq = httpReq.clone({ headers: httpReq.headers.set('Access-Control-Allow-Origin', '*') });

    let headers = httpReq.headers.set('Content-Type', 'application/json');

    if (headers.get('noToken') === 'noToken') {
      headers = headers.delete('Authorization').delete('noToken');
    }

    const newReq = httpReq.clone({ headers: headers });

    return next.handle(newReq)
      .pipe(
        map(
          // Succeeds when there is a response; ignore other events
          event => {
            if (event instanceof HttpResponse) {
              if (event.status === 200) {
                if (event.body.result === false) {
                  if (event.body.resultCode === RESULTS.JSONINVALID) {
                    this.authService.mostrarMensaje("El json de la solicitud es invalido, contacte el departamento de sistemas", MENSAJES.ERROR);
                  } else if (event.body.resultCode === RESULTS.ERROR) {
                    this.authService.mostrarMensaje("error en el servidor, contacte el departamento de sistemas:\n" + event.body.message, MENSAJES.ERROR);
                  } else if (event.body.resultCode === RESULTS.TOKENINVALID) {
                    this.authService.mostrarMensaje("Su sesion es invalida, inicie sesion de nuevo", MENSAJES.ERROR);
                  } else if (event.body.resultCode === RESULTS.TOKENEXPIRED) {
                    this.authService.mostrarMensaje("Su sesion ha expirado, inicie sesion de nuevo", MENSAJES.ERROR);
                  } else if (event.body.resultCode === RESULTS.NOTOKEN) {
                    this.authService.mostrarMensaje("El servicio de datos requiere autorizacion", MENSAJES.ERROR);
                  }
                  return null;
                }
              } else {
                this.authService.mostrarMensaje("no sussess", MENSAJES.ERROR);
                return null;
              }
            }
            return event;
          },
          // Operation failed; error is an HttpErrorResponse
          error => {
            if (error.status === 401) {
              this.authService.logout();
              location.reload(true);
            }
          }
        )
      );
  }
}
