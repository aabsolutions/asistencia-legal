import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor(private srvSettings: SettingsService) { }

  ngOnInit(): void {
    this.srvSettings.ponerVisto();
  }

  cambiarTema( color: string){
    this.srvSettings.cambiarTema(color);
  }

}
