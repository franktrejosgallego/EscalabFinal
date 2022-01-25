import { Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { MENSAJES } from '../Constantes';
import { LS_USER } from '../Constantes';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

@Injectable()
export class AuthService {
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private Usuario: any;

  @Input('usuario')
  get usuario(): any {
    if (!this.Usuario) {
      const usr = localStorage.getItem(LS_USER);
      if (usr !== null) {
        this.Usuario = JSON.parse(usr);
        this.loggedIn.next(true);
      }
    }
    return this.Usuario;
  }
  set usuario(val) {
    this.Usuario = val;
    localStorage.setItem(LS_USER, JSON.stringify(this.Usuario));
  }

  public: any;

  constructor(
    private router: Router,
    public messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  public logged(state: boolean) {
    this.loggedIn.next(state);
  }

  logout() {
    localStorage.clear();

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  validarPermiso(codigos: number[]): boolean {
    return true;
  }

  mostrarMensaje(mensaje: string, tipo: number): void {
    if (tipo === MENSAJES.ERROR) {
      this.messageService.add({ severity: 'error', summary: 'ERROR', detail: mensaje, life: 3000 });
    } else if (tipo === MENSAJES.SUSSES) {
      this.messageService.add({ severity: 'success', summary: 'MENSAJE', detail: mensaje, life: 3000 });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'MENSAJE', detail: mensaje, life: 3000 });
    }
  }

  confirmacionMensaje(titulo: string, pregunta: string, confirm, rejectFunction) {
    this.confirmationService.confirm({
      message: pregunta,
      header: titulo,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: confirm,
      reject: rejectFunction
    });
  }

}
