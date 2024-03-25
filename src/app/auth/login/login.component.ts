import { Component, ElementRef, NgZone, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

// import { UsuarioService } from 'src/app/services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public formSumitted = false;

  public loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || 'angelbs.1985@gmail.com' , [ Validators.required, Validators.email ] ],
    password: ['12345', Validators.required ],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private ngZone: NgZone,
               private usuarioSvr: UsuarioService
               ){
  }

  loginUsuario(){

    this.usuarioSvr.login( this.loginForm.value )
      .subscribe( resp => {

        if ( this.loginForm.get('remember')?.value ){ 
          localStorage.setItem('email', this.loginForm.get('email')?.value );
        } else {
          localStorage.removeItem('email');
        }

        // Navegar al Dashboard
         this.ngZone.run(() => {
        this.router.navigateByUrl('/');
      })
      }, (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error' );
      });
  }
  
}