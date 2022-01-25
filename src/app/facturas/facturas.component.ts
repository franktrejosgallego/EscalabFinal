import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PedidoService } from '../pedido/pedido.service';
import { AuthService } from '../global/auth/auth.service';
import { MENSAJES } from '../global/Constantes';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  form: FormGroup;
  facturas: TreeNode[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      opcion: ['1'],
      desde: ['', Validators.required],
      hasta: ['', Validators.required],
      vendedor: [this.authService.usuario.usuario]
    });
    const currentDate = new Date();
    const inidate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.form.get('hasta').setValue(currentDate);
    this.form.get('desde').setValue(inidate);
  }

  async submit() {
    if (this.form.valid) {
      this.facturas = [];
      try {
        const res = await this.pedidoService.GetFacuras(this.form.value);
        if (res.data && res.data.length > 0) {
          // const empresas = ;
          // const lista = new Set(empresas);
          const empresas: string[] = res.data.map(x => x.empresa);
          empresas.forEach(element => {
            const facturas = res.data.filter(x => x.empresa == element);
            var empresaTotal: TreeNode = {
              data: { nombre: element, total: 0, saldo: 0 },
              leaf: false,
              expanded: false,
              children: []
            };
            this.facturas.push(empresaTotal);
            facturas.forEach(fact => {
              const factura: TreeNode = {
                data: { nombre: fact.documento, total: fact.total, saldo: fact.saldo },
                leaf: false,
                expanded: false
              };
              empresaTotal.data.total += fact.total;
              empresaTotal.data.saldo += fact.saldo;
              empresaTotal.children.push(factura);
            });
          });

          const dats = JSON.stringify(this.facturas);
          this.facturas = JSON.parse(dats);
          console.log(dats);
        }
      } catch (e) {
        this.authService.mostrarMensaje('Ocurrio un Problema, vuelva a intentarlo', MENSAJES.ERROR);
        console.error(e);
      }
    }
  }

}
