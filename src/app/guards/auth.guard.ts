import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuariosSvr: UsuarioService,
              private router: Router){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuariosSvr.validarToken()
    .pipe(
      tap(
        authOk => {
          if(!authOk){
            this.router.navigateByUrl('/login');
          }
        }
      )
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    {
      return this.usuariosSvr.validarToken()
        .pipe(
          tap(
            authOk => {
              if(!authOk){
                this.router.navigateByUrl('/login');
              }
            }
          )
        );
    }
  
}
