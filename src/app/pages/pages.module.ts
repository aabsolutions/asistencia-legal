import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ClienteComponent } from './mantenimientos/clientes/cliente.component';
import { ClientesComponent } from './mantenimientos/clientes/clientes.component';import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SubtemaComponent } from './mantenimientos/temas/subtema.component';
import { TemaComponent } from './mantenimientos/temas/tema.component';
import { TemasComponent } from './mantenimientos/temas/temas.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { BusquedaComponent } from './busqueda/busqueda.component';


@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    PerfilComponent,
    UsuariosComponent,
    TemasComponent,
    TemaComponent,
    SubtemaComponent,
    ClientesComponent,
    ClienteComponent,
    BusquedaComponent
  ],
  exports: [
    DashboardComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    PipesModule    
  ]
})
export class PagesModule { }
