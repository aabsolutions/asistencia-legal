import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Usuario } from 'src/app/models/usuario.model';
import { Cliente } from 'src/app/models/cliente.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { Tema } from 'src/app/models/tema.model';
import { TemaService } from 'src/app/services/tema.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit{

  public usuariosEncontrados: Usuario[] = [];
  public clientesEncontrados: Cliente[] = [];
  public temasEncontrados: Tema[] = [];

  

  constructor( private activatedRoute: ActivatedRoute,
               private busquedaSrv: BusquedasService,
               private temaSrv: TemaService){}

               
  ngOnInit(): void {
    this.activatedRoute.params
        .subscribe( ({ termino }) => this.busquedaGlobal(termino) )
  }

  busquedaGlobal( termino: string){
    this.busquedaSrv.buscarTodo(termino)
        .subscribe( (resp: any) => {
          this.usuariosEncontrados = resp.coincidenciasUsuario;
          this.clientesEncontrados = resp.coincidenciasCliente;
          this.temasEncontrados = resp.coincidenciasTema;
        } )
  }

  async mostrarModalTema(id: string){
    this.temaSrv.cargarTemaPorId(id)
        .subscribe( (tema: Tema) => { 
            Swal.fire({
              title: tema.asunto,
              text: tema.texto,
              footer: `Cliente: ${tema.cliente.nombre_completo}`,
              icon: "info"
            });
          });
  }
}
