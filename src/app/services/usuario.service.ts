import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ElementRef, Injectable, NgZone, ViewChild } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators'
import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, pipe, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/usuario.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {}

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get role(): 'ADMIN_ROLE'|'USER_ROLE'{
      return this.usuario.role;
  }

  get headers(){
    return {
        headers:{
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( token: string, menu: any){
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) );
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
    })
  }

  validarToken(): Observable<boolean> {
    
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { nombre, email, img='', google, role, uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, role, uid );
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: RegisterForm){
    return this.http.post(`${base_url}/usuarios`,formData)
      .pipe(
        tap( (resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);

  }

  login( formData: LoginForm){
    return this.http.post(`${base_url}/login`,formData)
      .pipe(
        tap( (resp: any) => {
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  cargarUsuarios( desde: number = 0 )
  {
    const url = `${ base_url}/usuarios?from=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers )
      .pipe(
        map( resp => {
          const usuarios = resp.usuarios.map(
            //hay que tener presente el orden en el que se traen los datos desde el modelo
            user => new Usuario(user.nombre, user.email, '', user.img, user.role, user.uid)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario( usuario: Usuario){
    const url = `${ base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers );
  }

  guardarUsuario( usuario: Usuario ){

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);

  }
 
}


