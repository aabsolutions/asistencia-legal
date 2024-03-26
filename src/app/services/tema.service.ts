import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Tema } from '../models/tema.model';
import { CargarTema } from '../interfaces/tema.interface';
import { CargarSubtema } from '../interfaces/subtema.interface';
import { Subtema } from '../models/subtema.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  constructor(private http: HttpClient) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
        headers:{
        'x-token': this.token
      }
    }
  }

  cargarTemas( desde: number = 0, limite: number = 0)
  {
    const url = `${ base_url}/temas?from=${desde}&limit=${limite}`;
    return this.http.get<CargarTema>(url, this.headers )
        .pipe(
          map( resp => {
            const temas = resp.temas.map(
              //hay que tener presente el orden en el que se traen los datos desde el modelo
              tema => new Tema(tema.asunto, tema.texto, tema.fecha, tema.cliente, tema._id, tema.usuario, tema.adjunto)
            );
            return {
              total: resp.total,
              temas
            };
          })
        )
  }

  cargarSubtemas( idTema: string )
  {
    const url = `${ base_url }/subtemas/tema/${ idTema }`;
    return this.http.get<CargarSubtema>(url, this.headers )
        .pipe(
          map( resp => {
            const subtemas = resp.subtemas.map(
              //hay que tener presente el orden en el que se traen los datos desde el modelo
              tema => new Subtema(tema.asunto, tema.texto, tema.fecha, tema.tema, tema._id, tema.usuario)
            );
            return {
              total: resp.total,
              subtemas
            };
          })
        )
  }

  cargarTemasPorCliente( id: string, desde: number = 0, limite: number = 0)
  {
    const url = `${ base_url}/temas/cliente/${ id }`;
    return this.http.get<CargarTema>(url, this.headers )
        .pipe(
          map( resp => {
            const temas = resp.temas.map(
              //hay que tener presente el orden en el que se traen los datos desde el modelo
              tema => new Tema(tema.asunto, tema.texto, tema.fecha, tema.cliente, tema._id, tema.usuario, tema.adjunto)
            );
            return {
              total: resp.total,
              temas
            };
          })
        )
  }

  cargarTemaPorId( id: string )
  {
    const url = `${ base_url}/temas/${ id }`;
    return this.http.get(url, this.headers )
      .pipe(
        map( (resp: {ok: boolean, tema: Tema}) => resp.tema )   
      )
  }

  cargarSubtemaPorId( id: string )
  {
    const url = `${ base_url}/subtemas/${ id }`;
  
    return this.http.get(url, this.headers )
      .pipe(
        map( (resp: {ok: boolean, subtema: Subtema}) => resp.subtema )   
      )
  }

  crearTema( tema: Tema)
  {
    const url = `${ base_url}/temas`;
    return this.http.post(url, tema , this.headers );
  }

  crearSubtema( subtema: Subtema)
  {   
    const url = `${ base_url }/subtemas/${ subtema.tema }`;
    return this.http.post(url, subtema , this.headers );
  }

  actualizarTema( tema: Tema)
  {
    const url = `${ base_url}/temas/${tema._id}`;
    return this.http.put(url, tema , this.headers );
    
  }

  actualizarSubtema( subtema: Subtema)
  {
    const url = `${ base_url}/subtemas/${subtema._id}`;
    return this.http.put(url, subtema , this.headers );
    
  }

  eliminarTema( _id: string)
  {

    const url = `${ base_url}/temas/${_id}`;
    return this.http.delete(url, this.headers );
  }

  eliminarSubtema( _id: string)
  {
    const url = `${ base_url}/subtemas/${_id}`;
    return this.http.delete(url, this.headers );
  }


}
