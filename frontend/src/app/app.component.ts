import { Component, HostListener, OnInit } from '@angular/core';
import { SettingsService } from './shared/services/settings.service';

const WIDTH_MOBILE = 768;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private settings: SettingsService) {}

  ngOnInit(): void {
    this.settings.isMobile = window.innerWidth <= WIDTH_MOBILE;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.settings.isMobile = event.target.innerWidth <= WIDTH_MOBILE;
  }
}
