import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, delay } from 'rxjs';
import { Tema } from 'src/app/models/tema.model';
import { Cliente } from 'src/app/models/cliente.model';
import { TemaService } from 'src/app/services/tema.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styles: [
  ]
})

export class ClienteComponent implements OnInit {

  public clienteForm: FormGroup;
  public clienteSeleccionado: Cliente;

  public imgSubs: Subscription;
  public temas: Tema[] = [];

  constructor(private fb: FormBuilder,
              private clienteSrv: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalImagenSrv: ModalImagenService){}

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => this.cargarCliente(id) );

    this.clienteForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      direccion: ['', Validators.required],
      celular: ['', Validators.required],
      correo: ['', Validators.required],
      tipo_cliente: ['', Validators.required]
    });
  }



  cargarCliente( id: string ){
    if(id === 'nuevo'){
      return;
    }

    this.clienteSrv.cargarClientePorId(id)
        .subscribe( cliente => {

          if( !cliente ){
            return this.router.navigateByUrl(`/dashboard/clientes`);
          }

          const { cedula, nombre_completo, direccion, celular, correo, tipo_cliente } = cliente;
          
          this.clienteSeleccionado = cliente;
          this.clienteForm.setValue({cedula, nombre_completo, direccion, celular, correo, tipo_cliente});
  
          return true;
        }
      )
  }

  guardarCliente(){

    const { nombre_completo } = this.clienteForm.value;

    if(this.clienteSeleccionado){
      const cid = this.clienteSeleccionado._id;
      const data = {
        //van todos los campos del formulario más el id del cliente seleccionado
        _id: cid,
        ...this.clienteForm.value,        
      }
      this.clienteSrv.actualizarCliente(data)
          .subscribe(
            resp => {
              Swal.fire('Actualizado', `${ nombre_completo } actualizado correctamente`, 'success');
              this.router.navigateByUrl(`/dashboard/clientes/`);
            }
          )
    }else{
      
    this.clienteSrv.crearCliente(this.clienteForm.value)
      .subscribe(
        (resp: any) => {
          Swal.fire('Creado', `${ nombre_completo } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/clientes/`);
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error' );
        }
      )
    }    
  }

  abrirModal(cliente: Cliente){
    this.modalImagenSrv.abrirModal('clientes',cliente._id)
  }
    

  
}
