import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente.model';
import { CargarCliente } from '../interfaces/cliente.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

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

  cargarClientes(desde: number = 0, limite: number = 0)
  {
    const url = `${ base_url}/clientes?from=${desde}&limit=${limite}`;
    // return this.http.get(url, this.headers )
    //   .pipe(
    //     map( (resp: {ok: boolean, clientes: Cliente[]}) => resp.clientes )   
    //   )
    return this.http.get<CargarCliente>(url, this.headers )
      .pipe(
        map( resp => {
          const clientes = resp.clientes.map(
            //hay que tener presente el orden en el que se traen los datos desde el modelo
            cliente => new Cliente(cliente.cedula, cliente.nombre_completo, cliente.direccion, cliente.celular, cliente.correo, cliente.tipo_cliente, cliente.img, cliente.usuario, cliente._id)
          );
          return {
            total: resp.total,
            clientes
          };
        })
      )
  }

  cargarClientePorId( id: string )
  {
    const url = `${ base_url}/clientes/${ id }`;
    return this.http.get(url, this.headers )
      .pipe(
        map( (resp: {ok: boolean, cliente: Cliente}) => resp.cliente )   
      )
  }

  crearCliente( cliente: Cliente)
  {
    const url = `${ base_url}/clientes`;
    return this.http.post(url, cliente , this.headers );
  }

  actualizarCliente( cliente: Cliente)
  {
    const url = `${ base_url}/clientes/${cliente._id}`;
    return this.http.put(url, cliente, this.headers );
  }

  eliminarCliente( _id: string)
  {
    const url = `${ base_url}/clientes/${_id}`;
    return this.http.delete(url, this.headers );
  }


}
