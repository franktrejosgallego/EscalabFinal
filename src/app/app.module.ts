import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-component/app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './global/app-material.module';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
////////////////////////////////////////////////////////////
// componentes y demas desarrollados
import { LoginService } from './logincomponent/login.service';
import { MyHttpInterceptor } from './global/MyHttpInterceptor';
import { AuthGuard } from './global/auth/auth.guard';
import { AuthService } from './global/auth/auth.service';
import { LoginComponent } from './logincomponent/login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CambarClaveSolicitudComponent } from './logincomponent/cambar-clave-solicitud/cambar-clave-solicitud.component';
import { CambarClaveAccionComponent } from './logincomponent/cambar-clave-accion/cambar-clave-accion.component';
import { PedidoComponent } from './pedido/pedido.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FacturasComponent } from './facturas/facturas.component';

@NgModule({
  declarations: [
    AppComponent,
    PedidoComponent,
    LoginComponent,
    NotFoundComponent,
    CambarClaveSolicitudComponent,
    CambarClaveAccionComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    FormsModule,
    // NgbModule.forRoot(),
    ReactiveFormsModule,
    AppMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    AuthService, AuthGuard, LoginService, MessageService, ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
