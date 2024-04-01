import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';

import { TemaService } from 'src/app/services/tema.service';
import { Tema } from 'src/app/models/tema.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { Subtema } from 'src/app/models/subtema.model';

import { FileUploadService } from 'src/app/services/file-upload.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tema',
  templateUrl: './tema.component.html',
  styles: [
  ]
})

export class TemaComponent implements OnInit {

  public temaForm: FormGroup;
  public imgSubs: Subscription;
  public temaSeleccionado: Tema;
  public subtemaSeleccionado: Subtema;
  
  public idTemaSeleccionado: string;
  public ultimaModificacion: string;
  public ultimoUsuario: string;
  public clientes: Cliente[] = [];
  public subtemas: Subtema[] = [];
  public mostrarSubtemas: boolean = false;

  public today: Date = new Date();
  public pipe = new DatePipe('en-EN');
  public todayWithPipe = null;
  public dateWithPipe = null;

  public activaBtnSubtemas: boolean = false;

  public archivoSubir: File;
  public imgTemp: any = null;
  public urlAdjunto: string;
  public hayAdjunto: boolean = false;

  constructor(private fb: FormBuilder,
              private temaSrv: TemaService,
              private clienteSrv: ClienteService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private fileUploadService: FileUploadService){}

  ngOnInit(): void {

    this.temaForm = this.fb.group({
      asunto: ['', Validators.required],
      texto: ['', Validators.required],
      cliente: ['', Validators.required]
    });
    this.temaForm.get('cliente').disable();


    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.idTemaSeleccionado = id;
      this.cargarTema(id);
    } );
    this.cargarClientes();

  }

  cargarClientes(){
    this.clienteSrv.cargarClientes(0)
      .subscribe(
        ( ({clientes}) =>{
          this.clientes = clientes;
        })
      ) 
  }



  cargarTema( id: string ){

    if(id === 'nuevo'){
      this.mostrarSubtemas = false;
      this.activaBtnSubtemas = true;
      this.temaForm.get('cliente').enable();
      return;
    }

    this.temaSrv.cargarTemaPorId(id)
        .subscribe( (tema: Tema) => {

          if( !tema ){
            return this.router.navigateByUrl(`/dashboard/temas`);
          }

          const { asunto, texto, cliente } = tema;

          this.temaSeleccionado = tema;
          this.dateWithPipe = this.pipe.transform(this.temaSeleccionado.updatedAt, 'dd/MM/yyyy');  
          this.ultimaModificacion = this.dateWithPipe;
          this.ultimoUsuario = this.temaSeleccionado.usuario.nombre;

          if(this.temaSeleccionado.img_secure_url){
            this.hayAdjunto = true;
            this.urlAdjunto = this.temaSeleccionado.img_secure_url;
          }
          this.temaForm.setValue({ asunto, texto, cliente: cliente._id });
          this.mostrarSubtemas = true;
          this.cargarSubtemas(id);

          return true;
        }
      )
  }

  cargarSubtemas(idTema: string){
    this.temaSrv.cargarSubtemas(idTema)
    .subscribe(
      ( ({subtemas}) =>{
        this.subtemas = subtemas;
      })
    ) 
  }
    
  goBack(): void {
    this.location.back();
  }

  guardarTema(){

    if(this.temaSeleccionado){

      const tid = this.temaSeleccionado._id;

      const data: Tema = {
        //van todos los campos del formulario más el id del usuario y cliente del tema seleccionado
        _id: tid,
        ...this.temaForm.value,
        usuario: this.temaSeleccionado.usuario,
        cliente: this.temaSeleccionado.cliente,
        fecha: this.temaSeleccionado.fecha,
        img_public_id: this.temaSeleccionado.img_public_id,
        img_secure_url: this.temaSeleccionado.img_secure_url
      }

      //aquí hay que eliminar de la cloud también

      console.log(data);

      this.temaSrv.actualizarTema(data)
          .subscribe(
            resp => {
              Swal.fire('Actualizado', `Tema actualizado correctamente`, 'success');
              this.router.navigateByUrl(`/dashboard/temas/`);
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error' );
            }
          )
    }else{

      this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
  
      const dataNuevoTema = {
        ...this.temaForm.value,
        fecha: this.todayWithPipe
      }

      this.temaSrv.crearTema(dataNuevoTema)
      .subscribe(
        (resp: any) => {
          Swal.fire('Creado', `Tema creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/temas/`);
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error' );
        }
      )
    }    
  }

  async mostrarModalSubtema(id: string){
    this.temaSrv.cargarSubtemaPorId(id)
        .subscribe( (subtema: Subtema) => { 
            Swal.fire({
              title: subtema.asunto,
              text: subtema.texto,
              footer: `Registrado por: ${subtema.usuario.nombre}`,
              icon: "info"
            });
          });
  }

  eliminarSubtema(subtema: Subtema){
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: `Está a punto de borrar el subtema: ${ subtema.asunto }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.value) {
        this.temaSrv.eliminarSubtema(subtema._id)
          .subscribe( resp => {
            this.cargarSubtemas(this.idTemaSeleccionado);
            Swal.fire(
              'Subtema borrado.',
              `EL subtema: ${ subtema.asunto } fue eliminado corréctamente`,
              'success'
            )
          })  
      }
    })
  }

  cambiarArchivo( file: File ) {
    this.archivoSubir = file;

    if ( !file ) { 
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  eliminarAdjunto(tema: Tema){
    this.temaSeleccionado.img_public_id = null;
    this.temaSeleccionado.img_secure_url = null;
    this.guardarTema();
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto( this.archivoSubir, 'temas', this.temaSeleccionado._id )
      .then( img => {
        this.temaSeleccionado.img_secure_url = img;
        Swal.fire('Guardado', 'Adjunto registrado con éxito', 'success');
        this.router.navigateByUrl(`/dashboard/temas/`);
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

  regresarTemas()
  {
    this.router.navigateByUrl(`/dashboard/temas`);
  }

}
