import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';

import { Subtema } from 'src/app/models/subtema.model';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { TemaService } from 'src/app/services/tema.service';

@Component({
  selector: 'app-subtema',
  templateUrl: './subtema.component.html',
  styles: [
  ]
})

export class SubtemaComponent implements OnInit {

  public subtemaForm: FormGroup;
  public imgSubs: Subscription;
  public idTemaSeleccionado: string;
  public idSubtemaSeleccionado: string;

  public subtemaSeleccionado: Subtema;
  public subtemas: Subtema[] = [];
  public mostrarSubtemas: boolean = false;

  public today: Date = new Date();
  public pipe = new DatePipe('en-EN');
  public todayWithPipe = null;

  public archivoSubir: File;
  public imgTemp: any = null;
  public urlAdjunto: string;
  public hayAdjunto: boolean = false;

  constructor(private fb: FormBuilder,
              private temaSrv: TemaService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private fileUploadService: FileUploadService){}

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id, tid, caso}) => {
          if(caso==='n'){
            this.idTemaSeleccionado = tid;
          }else if(caso==='u'){
            this.idTemaSeleccionado = tid;
            this.idSubtemaSeleccionado = id;
            this.cargarSubtema(caso,id);
          }
        } 
      );

    this.subtemaForm = this.fb.group({
      asunto: ['', Validators.required],
      texto: ['', Validators.required]
    });

  }

  cargarSubtema( caso: string, id: string ){

    if(caso === 'n'){
      return;
    }else if(caso === 'u'){
      this.temaSrv.cargarSubtemaPorId(id)
      .subscribe( (subtema: Subtema) => {
          if( !subtema ){
            return this.router.navigateByUrl(`/dashboard/temas`);
          }
          
          const { asunto, texto } = subtema;

          this.subtemaSeleccionado = subtema;
          this.subtemaForm.setValue({ asunto, texto });

          if(this.subtemaSeleccionado.img_secure_url){
            this.hayAdjunto = true;
            this.urlAdjunto = this.subtemaSeleccionado.img_secure_url;
          }
          return true;
        }
      )
    }
   
  }
 
  goBack(): void {
    this.location.back();
  }

  guardarSubtema(){
   
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');

    if(this.subtemaSeleccionado){
      const stid = this.idSubtemaSeleccionado;
      const data: Subtema = {
        _id: stid,
        ...this.subtemaForm.value,
        fecha: this.todayWithPipe,
        img_public_id: this.subtemaSeleccionado.img_public_id,
        img_secure_url: this.subtemaSeleccionado.img_secure_url
      }

      this.temaSrv.actualizarSubtema(data)
          .subscribe(
            resp => {
              Swal.fire('Actualizado', `Subtema actualizado correctamente`, 'success');
              this.router.navigateByUrl(`/dashboard/temas/${this.idTemaSeleccionado}`);
            },
            (err) => {
              Swal.fire('Error', err.error.msg, 'error' );
            }
          )
    }else{
 
      const dataNuevoSubtema = {
        ...this.subtemaForm.value,
        fecha: this.todayWithPipe,
        tema: this.idTemaSeleccionado
      }

      this.temaSrv.crearSubtema(dataNuevoSubtema)
      .subscribe(
        (resp: any) => {
          Swal.fire('Creado', `Subtema creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/temas/${this.idTemaSeleccionado}`);
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error' );
        }
      )
    }
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

  eliminarAdjunto(){
    this.subtemaSeleccionado.img_public_id = null;
    this.subtemaSeleccionado.img_secure_url = null;
    this.guardarSubtema();
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto( this.archivoSubir, 'subtemas', this.subtemaSeleccionado._id )
      .then( img => {
        this.subtemaSeleccionado.img_secure_url = img;
        Swal.fire('Guardado', 'Adjunto registrado con éxito', 'success');
        this.router.navigateByUrl(`/dashboard/temas/${this.idTemaSeleccionado}`);
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })
  }

}
