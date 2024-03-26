import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemaService } from '../../../services/tema.service';
import { Tema } from 'src/app/models/tema.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styles: [
  ]
})
export class TemasComponent implements OnInit{

  public temas: Tema[] = [];
  public temasTemp: Tema[] = [];
  public idClienteSeleccionado: string;
  public clienteSeleccionado: Cliente;
  public encabezado: string = 'Todos';
  public cargando: boolean = false;
  public imgSubs: Subscription;
  public desde: number = 0;
  public totalTemas: number;

  constructor( private temaSrv: TemaService,
               private modalImagenSrv: ModalImagenService,
               private busquedasSrv: BusquedasService,
               private clienteSrv: ClienteService,
               private activatedRoute: ActivatedRoute){}
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe;
  }
  
  ngOnInit(): void {
    
    this.imgSubs = this.imgSubs = this.modalImagenSrv.imagenCambio
    .pipe(delay(200))
    .subscribe(img => this.cargarTemas());

    this.activatedRoute.params
        .subscribe( ({id}) => {
          if(id){
            this.idClienteSeleccionado = id;
            this.cargarCliente(id);
            this.cargarTemasPorCliente(id);
          }else{
            this.cargarTemas();
          }
        } );
  
  }

  cargarTemasPorCliente(id: string){
    this.cargando = true;
      this.temaSrv.cargarTemasPorCliente(id, this.desde)
      .subscribe(
          ({total, temas}) => {
            this.totalTemas = total;
            this.temas = temas;
            this.temasTemp = temas;
            this.cargando = false;
          }
      )     
  }

  cargarTemas(){
    this.cargando = true;

      this.temaSrv.cargarTemas(this.desde)
      .subscribe(
          ({total, temas}) => {
            this.totalTemas = total;
            this.temas = temas;
            this.temasTemp = temas;
            this.cargando = false;
          }
      )     
  }

  cargarCliente( id: string ){
    this.clienteSrv.cargarClientePorId(id)
       .subscribe( cliente => {   
         this.clienteSeleccionado = cliente;
         this.encabezado = this.clienteSeleccionado.nombre_completo;
       }
     )
 }

  cambiarPagina( valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if(this.desde > this.totalTemas){
      this.desde -= valor;
    }
    this.cargarTemas();
  }

  guardarTema(tema: Tema){
    this.temaSrv.crearTema(tema)
        .subscribe( resp => {
          Swal.fire('Creado corréctamente','El tema ha sido creado', 'success');
      })
  }

  actualizarTema(tema: Tema){
    this.temaSrv.actualizarTema(tema)
        .subscribe( resp => {
          Swal.fire('Actualizado correctamente', 'El tema ha sido actualizado', 'success');
      })
  }

  eliminarTema(tema: Tema){
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: `Está a punto de borrar el tema: ${ tema.asunto }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.value) {
        this.temaSrv.eliminarTema(tema._id)
          .subscribe( resp => {
            this.cargarTemas();
            Swal.fire(
              'Tema borrado.',
              `Eliminado corréctamente`,
              'success'
            )
          })  
      }
    })
  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.temas = this.temasTemp;
    }

    if (this.idClienteSeleccionado){
      this.busquedasSrv.buscarFiltrado('temas', termino, this.idClienteSeleccionado)
      .subscribe(
        (resp: Tema[]) => {
          this.temas = resp;
        });
      return true;
    }else{
      this.busquedasSrv.buscar('temas', termino)
      .subscribe(
        (resp: Tema[]) => {
          this.temas = resp;
        });
      return true;
    }
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
