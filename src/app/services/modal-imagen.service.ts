import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'clientes'|'temas';
  public id: string;
  public img: string;
  public imagenCambio: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'clientes'|'temas',
    id: string,
    img: string = 'no-image'
  ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    console.log('Imagen es: ', img);
    if(img=='no-image' || img.length==0){
      this.img = 'https://res.cloudinary.com/aabsolutions/image/upload/v1711909048/asistencia_legal/no-image.jpg'
    }else{
      this.img = img;
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
