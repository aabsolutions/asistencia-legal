import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { AuthRoutingModule } from './auth/auth.routing';

const routes: Routes = [
  { path:'', redirectTo: '/dashboard', pathMatch: 'full' },
  { path:'**', component: NopagefoundComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
