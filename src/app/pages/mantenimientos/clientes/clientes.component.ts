import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Cliente } from 'src/app/models/cliente.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent implements OnInit, OnDestroy {

  public clientes: Cliente[] = [];  
  public clientesTemp: Cliente[] = [];
  public totalClientes: number;
  public desde: number = 0;
  public cargando: boolean = false;
  public imgSubs: Subscription;

  constructor( private clienteSrv: ClienteService,
               private modalImagenSrv: ModalImagenService,
               private busquedasSrv: BusquedasService){}
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe;
  }
        
  ngOnInit(): void {
    this.cargarClientes();
    this.imgSubs = this.imgSubs = this.modalImagenSrv.imagenCambio
    .pipe(delay(200))
    .subscribe(img => this.cargarClientes());
  }

  cargarClientes(){
    this.cargando = true;
    this.clienteSrv.cargarClientes(this.desde)
      .subscribe(
        ( ({total, clientes}) =>{
          this.clientes= clientes;
          this.clientesTemp = clientes;
          this.totalClientes = total;
          this.cargando = false;
        })
      )
  }

  cambiarPagina( valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if(this.desde > this.totalClientes){
      this.desde -= valor;
    }
    this.cargarClientes();
  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.clientes = this.clientesTemp;
    }

    this.busquedasSrv.buscar('clientes', termino)
      .subscribe(
        (resp: Cliente[]) => {
          this.clientes = resp;
        });
      return true;
  }

  eliminarCliente(cliente: Cliente){
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: `Está a punto de borrar el cliente: ${ cliente.nombre_completo }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.value) {
        this.clienteSrv.eliminarCliente(cliente._id)
          .subscribe( resp => {
            this.desde = 0;
            this.cargarClientes();
            Swal.fire(
              'Usuario borrado.',
              `${ cliente.nombre_completo } fue eliminado corréctamente`,
              'success'
            )
          })  
      }
    })
  }

  async mostrarModal(){
    const {value} = await Swal.fire<string>({
      title: 'Registro de nuevo cliente',
      input: 'text',
      inputPlaceholder: 'Escriba el nombre del nuevo cliente',
      showCancelButton: true,
      inputValidator: (value) => !value && 'Debe ingresar el nombre'
    });   
  }

  abrirModal(cliente: Cliente){
    this.modalImagenSrv.abrirModal('clientes', cliente._id );
  }


}
