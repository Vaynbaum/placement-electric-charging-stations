import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapPageComponent } from './map-page/map-page.component';
import { SharedModule } from './shared/shared.module';
import { SettingsService } from './shared/services/settings.service';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { environment } from 'src/environments/environment';
import { GeoService } from './shared/services/geo.service';

const mapConfig: YaConfig = {
  apikey: environment.API_KEY,
  lang: 'ru_RU',
};
@NgModule({
  declarations: [AppComponent, MapPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularYandexMapsModule.forRoot(mapConfig),
  ],
  providers: [SettingsService, GeoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
