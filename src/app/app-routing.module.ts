import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './global/auth/auth.guard';
import { LoginComponent } from './logincomponent/login/login.component';
import { CambarClaveAccionComponent } from './logincomponent/cambar-clave-accion/cambar-clave-accion.component';
import { CambarClaveSolicitudComponent } from './logincomponent/cambar-clave-solicitud/cambar-clave-solicitud.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PedidoComponent } from "./pedido/pedido.component";
import { FacturasComponent } from './facturas/facturas.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cambiarclave', component: CambarClaveSolicitudComponent },
  { path: 'setearclave', component: CambarClaveAccionComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'facturas', component: FacturasComponent },
  { path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
