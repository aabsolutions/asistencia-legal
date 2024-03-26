import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';

import { AdminGuard } from '../guards/admin.guard';
import { ClientesComponent } from './mantenimientos/clientes/clientes.component';
import { ClienteComponent } from './mantenimientos/clientes/cliente.component';
import { TemasComponent } from './mantenimientos/temas/temas.component';
import { TemaComponent } from './mantenimientos/temas/tema.component';
import { SubtemaComponent } from './mantenimientos/temas/subtema.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const childRoutes: Routes = [
  { path:'', component: DashboardComponent, data: { titulo: 'Dashboard' }, },
  
  //Rutas propias del usuario logeado
  { path:'perfil', component: PerfilComponent, data: { titulo: 'Perfil' } },
  { path:'settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' } },
  { path:'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Buscar' } },

  
  //Rutas protegidas para admin
  { path:'usuarios', canActivate: [AdminGuard] ,component: UsuariosComponent, data: { titulo: 'Mantenimiento de usuarios' } },
  
  //Rutas de temas y subtemas

  { path:'temas', component: TemasComponent, data: { titulo: 'Administración de temas' } },
  { path:'temas/:id', component: TemaComponent, data: { titulo: 'Administración de temas' } },
  { path:'temas/cliente/:id', component: TemasComponent, data: { titulo: 'Administración de temas' } },
  { path:'subtemas/:id', component: SubtemaComponent, data: { titulo: 'Administración de subtemas' } },
  { path:'subtemas/:caso/:tid/:id', component: SubtemaComponent, data: { titulo: 'Administración de subtemas' } },

  //Rutas de clientes
  { path:'clientes', component: ClientesComponent, data: { titulo: 'Administración de clientes' } },
  { path:'clientes/:id', component: ClienteComponent, data: { titulo: 'Administración de datos del cliente' } },
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { 


}
