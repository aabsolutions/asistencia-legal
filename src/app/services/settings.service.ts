import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private temaCarga = document.querySelector('#theme');

  constructor() {
    const url = localStorage.getItem('theme') || './assets/css/colors/default.css'
    this.temaCarga?.setAttribute('href', url);
   }

   cambiarTema( color: string){
    const url = `./assets/css/colors/${color}.css`;
    this.temaCarga?.setAttribute('href', url);
    localStorage.setItem('theme',url);
    this.ponerVisto();
  }

  ponerVisto(){    

    const links = document.querySelectorAll('.selector');

    links.forEach( elm => {
      
      elm.classList.remove('working');
      const btnTheme = elm.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.temaCarga?.getAttribute('href');

      if(btnThemeUrl===currentTheme){
        elm.classList.add('working');
      }
    });
  }

}
