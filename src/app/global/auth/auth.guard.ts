import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        const usr = localStorage.getItem('currentUser');
        if (usr === undefined || usr === null) {
          if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
          }
        }

        if (route.data && route.data['permission']) {
          /*if (!this.authService.validarPermiso(route.data['permission'])) {
            this.authService.mostrarMensaje('No tiene permiso para navegar esta pagina', 'ERROR');
            this.router.navigate(['/dashboard']);
            return false;
          }*/
        }

        this.authService.logged(true);
        return true;
      })
    );
  }
}
