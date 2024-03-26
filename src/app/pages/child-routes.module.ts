import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';


const childRoutes: Routes = [
  { path:'', component: DashboardComponent, data: { titulo: 'Dashboard' }, },
  { path:'perfil', component: PerfilComponent, data: { titulo: 'Perfil' } },
  { path:'settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' } },


]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { 


}
