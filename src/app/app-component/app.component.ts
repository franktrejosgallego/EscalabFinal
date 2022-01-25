import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { fadeAnimation } from './../global/router.animation';
import { AuthService } from './../global/auth/auth.service';
import { Observable } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnDestroy, OnInit {
  ruta = '';
  isLoggedIn$: Observable<boolean>;
  mobileQuery: MediaQueryList;
  openedSn = true;
  perfil: string;
  menu;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public authService: AuthService,
    private router: Router,
    private location: Location) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
    this.router.events.subscribe((val) => {
      if (this.location.path() !== '') {
        this.ruta = this.location.path()
          .substr(1)
          .replace('merge/-1', 'Crear')
          .replace('merge', 'Editar')
          .replace('/', ' - ')
          .replace('dashboard', 'Inicio')
          .replace('news', 'Noticias')
          .replace('misDatos', 'mis datos');
      } else {
        this.ruta = 'Inicio';
      }
    });
  }

  async ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    if (this.authService.usuario) {
      if (this.authService.usuario.vendedor) {
        this.perfil = "VENDEDOR";
      } else {
        this.perfil = "CLIENTE"
      }
      if (this.authService.usuario.menuItems) {
        this.menu = true;
      } else {
        this.menu = false;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
