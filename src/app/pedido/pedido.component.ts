import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from './pedido.service';
import { AuthService } from '../global/auth/auth.service';
import { Observable, from } from 'rxjs';
import { debounceTime, switchMap, map, filter } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { RUTAIMAGENES, MENSAJES, RESULTS, CONFIG } from '../global/Constantes';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;
  formProducto: FormGroup;
  hayProductos = false;
  mobileQuery: MediaQueryList;
  RUTAIMAGENES = RUTAIMAGENES;
  watcher: Subscription;
  terceroActivo = true;

  private formSubmitAttempt: boolean;
  filteredUsers: Observable<string[]>;
  filterednames: Observable<string[]>;
  productos: any[] = [];
  imageindex = 0;
  inventario: any;
  separado: any;
  productosPedido: any[] = [];
  image = '';
  productoSeleccionado: boolean;
  private seteando = false;
  mobileMode: boolean;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private pedidoService: PedidoService,
    public mediaObserver: MediaObserver) {

    this.form = this.fb.group({
      vendedor: [this.authService.usuario.usuario],
      observaciones: [''],
      nit: ['', Validators.required],
      rs: ['', Validators.required],
      dias: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.formProducto = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      nropedido: [0],
      valor_unitario: [0]
    });

    this.watcher = mediaObserver.asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        if (change.mqAlias === 'xs') {
          this.mobileMode = true;
        } else {
          this.mobileMode = false;
        }
      });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }


  ngAfterViewInit(): void {
    if (this.authService.usuario.vendedor === true) {
      document.getElementById('nit').focus();
    } else {
      document.getElementById('codigo').focus();
    }
  }

  ngOnInit() {
    if (this.authService.usuario && this.authService.usuario.vendedor === false) {
      this.form.get('nit').setValue(this.authService.usuario.usuario);
      this.form.get('rs').setValue(this.authService.usuario.nombre);
      this.form.get('dias').setValue(CONFIG.DIAS_PEDIDO);
      this.terceroActivo = false;
      // busqueda de pedido pendiente
      this.BuscarPEdidoPendiente();
    } else {
      this.filteredUsers = this.form.get('nit').valueChanges.pipe(
        debounceTime(400),
        switchMap(value => {
          if (this.seteando === false) {
            return this.pedidoService.cliente5nit({ nit: value });
          } else {
            return null;
          }
        })
      );

      this.filterednames = this.form.get('rs').valueChanges.pipe(
        debounceTime(400),
        switchMap(value => {
          if (this.seteando === false) {
            return this.pedidoService.cliente5rs({ rs: value });
          } else {
            return null;
          }
        })
      );
    }
  }

  BuscarPEdidoPendiente() {
    const datacon = {
      nit: this.form.getRawValue().nit
    };
    this.pedidoService.BuscarPendiente(datacon)
      .then(response => {
        if (response.data !== undefined && response.data !== null) {
          this.authService.mostrarMensaje('Hay un pedido habireto, se editara', MENSAJES.WARN);
          this.form.get('dias').setValue(response.data.dias);
          this.formProducto.get('nropedido').setValue(response.data.nropedido);
          if (response.data.prods) {
            this.productosPedido = response.data.prods;
          } else {
            this.productosPedido.length = 0;
          }
          this.ModoEdicion(false);
          document.getElementById('codigo').focus();
        } else {
          if (this.authService.usuario.vendedor === true) {
            document.getElementById('dias').focus();
          } else {
            document.getElementById('codigo').focus();
          }
        }
      })
      .catch(e => console.log(e));
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isFieldInvalid2(field: string) {
    return (
      (!this.formProducto.get(field).valid && this.formProducto.get(field).touched) ||
      (this.formProducto.get(field).untouched && this.formSubmitAttempt)
    );
  }

  selectClient(event: MatAutocompleteSelectedEvent) {
    if (!this.seteando) {
      this.seteando = true;
      const vector = event.option.viewValue.split('|');
      this.form.get('rs').setValue(vector[1].trim());
      this.form.get('nit').setValue(vector[0].trim());
      this.BuscarPEdidoPendiente();
      this.seteando = false;
    }
  }

  ModoEdicion(arg0: boolean) {
    if (arg0) {
      this.form.get('nit').enable();
      this.form.get('rs').enable();
      this.form.get('dias').enable();
    } else {
      this.form.get('nit').disable();
      this.form.get('rs').disable();
      this.form.get('dias').disable();
    }
  }

  async searchProductByCod(event) {
    if (event.key !== 'enter') {
      if (this.formProducto.value.codigo.length > 1) {
        const res = await this.pedidoService.productocod({ codigo: this.formProducto.value.codigo });
        if (res != null && res.data) {
          this.productos = res.data;
        }
      }
    }
  }

  async searchProductByNom(event) {
    if (this.formProducto.value.nombre.length > 4) {
      const res = await this.pedidoService.productonom({ nombre: this.formProducto.value.nombre });
      if (res != null && res.data) {
        this.productos = res.data;
      }
    }
  }

  async submitPRoduct() {
    try {
      let insertar = true;
      if (this.formProducto.valid) {
        if (this.form.valid) {
          if (this.formProducto.value.nropedido === undefined || this.formProducto.value.nropedido === null
            || this.formProducto.value.nropedido === 0) {
            const res = await this.pedidoService.CrearPedido(this.form.value);
            if (res.data != null && res.data > 0) {
              this.formProducto.get('nropedido').setValue(res.data);
              insertar = true;
              this.ModoEdicion(false);
            } else {
              insertar = false;
            }
          }

          if (this.productosPedido.length > 0) {
            this.productosPedido.forEach(element => {
              if (element.codigo === this.formProducto.value.codigo) {
                this.authService.mostrarMensaje('Este producto ya fue agregado, si dese editar elimine primero', MENSAJES.ERROR);
                insertar = false;
              }
            });
          }

          if (insertar === true) {
            const resins = await this.pedidoService.insertarProducto(this.formProducto.value);
            if (resins !== undefined && resins !== null) {
              if (resins.resultCode === RESULTS.REPITED) {
                this.authService.mostrarMensaje('Este producto ya fue agregado, si dese editar elimine primero', MENSAJES.ERROR);
              } else if (resins.resultCode === RESULTS.NOAFECTED) {
                this.authService.mostrarMensaje('No se pudo agregar el producto, intentelo de nuevo', MENSAJES.ERROR);
              } else {
                this.authService.mostrarMensaje('Producto agregado', MENSAJES.SUSSES);
                this.productosPedido.push(this.formProducto.value);
                this.formProducto.get('codigo').setValue('');
                this.formProducto.get('nombre').setValue('');
                this.formProducto.get('cantidad').setValue('');
                document.getElementById('codigo').focus();
              }
            }
          }
        } else {
          if (this.form.value.nit === '') {
            this.authService.mostrarMensaje('Debe seleccionar un cliente', MENSAJES.ERROR);
            document.getElementById('nit').focus();
          } else if (this.form.value.dias === '') {
            this.authService.mostrarMensaje('Debe ingresar primero los dias', MENSAJES.ERROR);
            document.getElementById('dias').focus();
          }
        }
      }
      this.formSubmitAttempt = true;
    } catch (e) {
      console.error(e);
    }
  }

  seleccionFirstEnt(event) {
    this.seleccionFirst();
    return false;
  }

  seleccionFirst() {
    if (this.productos.length > 0) {
      this.setearBusqueda(this.productos[0]);
      document.getElementById('cantidad').focus();
      this.productos.length = 0;
    } else {
      if (this.formProducto.value.codigo.length > 0 || this.formProducto.value.nombre.length > 0) {
        this.authService.mostrarMensaje('No existe un producto con este Codigo/Nombre', MENSAJES.ERROR);
      }
      this.formProducto.get('codigo').setValue('');
      this.formProducto.get('nombre').setValue('');
      this.formProducto.get('valor_unitario').setValue('');
      this.inventario = 0;
      this.separado = 0;
      this.productoSeleccionado = false;
    }
  }

  seleccionBusqueda(producto: any) {
    if (producto && producto !== null) {
      this.setearBusqueda(producto);
      this.productos.length = 0;
      document.getElementById('cantidad').focus();
    }
  }

  setearBusqueda(producto: any) {
    this.formProducto.get('codigo').setValue(producto.codigo);
    this.formProducto.get('nombre').setValue(producto.nombre);
    this.formProducto.get('valor_unitario').setValue(producto.preciocredito);
    this.inventario = producto.inventario;
    this.separado = producto.cantidad_separada;
    if (producto.image) {
      this.image = RUTAIMAGENES + producto.codigo + '/' + producto.image;
    } else {
      this.image = undefined;
    }
    this.productoSeleccionado = true;
  }

  onSubmitCli() {
    document.getElementById('codigo').focus();
  }

  focusDias() {
    document.getElementById('codigo').focus();
  }

  eliminarProducto(producto) {
    this.authService.confirmacionMensaje('CONFIRMACION', 'Desea eliminar este producto?', () => {
      const dataelim = {
        nit: this.form.getRawValue().nit,
        nropedido: this.formProducto.getRawValue().nropedido,
        codigo: producto.codigo
      };
      this.pedidoService.EliminarProducto(dataelim).then(respuesta => {
        if (respuesta !== undefined && respuesta !== null) {
          if (respuesta.resultCode === RESULTS.USERINVALID) {
            this.authService.mostrarMensaje('No se puede modificar este pedido por este usuario', MENSAJES.ERROR);
          } else if (respuesta.resultCode === RESULTS.OK) {
            this.authService.mostrarMensaje('Producto eliminado con exito', MENSAJES.SUSSES);
            document.getElementById('codigo').focus();
          }
        }
      }).catch(e => {
        this.authService.mostrarMensaje('Ocurrio un problema, intentelo de nuevo', MENSAJES.ERROR);
      });
    }, () => { });
  }

  Finalizar() {
    this.productos.length = 0;
    this.productosPedido.length = 0;
    this.formProducto.get('codigo').setValue('');
    this.formProducto.get('nombre').setValue('');
    this.formProducto.get('cantidad').setValue('');
    this.formProducto.get('nropedido').setValue(0);
    this.formProducto.get('valor_unitario').setValue(0);
    if (this.authService.usuario.vendedor === true) {
      this.form.get('nit').setValue('');
      this.form.get('rs').setValue('');
      this.form.get('dias').setValue('');
      document.getElementById('nit').focus();
    } else {
      document.getElementById('codigo').focus();
    }
    this.ModoEdicion(true);
  }

  Cancelar() {
    this.authService.confirmacionMensaje('CONFIRMACION', 'Desea cancelar éste pedido?', () => {
      const dataser = {
        nit: this.form.getRawValue().nit,
        nropedido: this.formProducto.value.nropedido
      };
      this.pedidoService.cancelarPedido(dataser).then(res => {
        if (res.resultCode === RESULTS.OK) {
          this.authService.mostrarMensaje('Pedido anulado con éxito', MENSAJES.SUSSES);
          this.Finalizar();
        } else if (res.resultCode === RESULTS.USERINVALID) {
          this.authService.mostrarMensaje('Este pedido no se pudo anular, comuniquese con el departamento de cartera', MENSAJES.WARN);
        } else {
          this.authService.mostrarMensaje('No se pudo anular este pedido', MENSAJES.WARN);
        }
      })
        .catch(e => {
          this.authService.mostrarMensaje('Hubo un problema con el servidor, intentelo de nuevo', MENSAJES.WARN);
        });
    }, () => {
      console.log('Accion cancelada');
    });
  }
}
