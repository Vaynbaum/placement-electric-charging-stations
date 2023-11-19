import { YaReadyEvent } from 'angular8-yandex-maps';
import { FullCity } from '../shared/models/city.model';
import { SettingsService } from './../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';
import { Polygon } from '../shared/models/polygon.model';

@Component({
  selector: 'app-map',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements OnInit {
  constructor(public settings: SettingsService) {}
  selectedCity: any = null;

  defaultPosition = { center: [55.751952, 37.600739] };
  position = this.defaultPosition;
  map: ymaps.Map | null = null;

  ngOnInit(): void {}

  selectModeSidenav() {
    if (this.settings.isMobile) return 'over';
    return 'side';
  }
  selectBackdrop() {
    if (this.settings.isMobile) return 'true';
    return 'false';
  }

  reversePolygon(coordinates: any[][]) {
    coordinates.forEach((coords) => {
      coords.forEach((coord) => {
        coord.reverse();
      });
    });
  }

  onMapReady(event: YaReadyEvent<ymaps.Map>): void {
    this.map = event.target;
  }

  buildCoordinates(border: Polygon) {
    let coords = [];
    if (border.type == 'Polygon') {
      coords = border.coordinates;
    } else {
      coords = border.coordinates[0];
    }
    this.reversePolygon(coords);
    return coords;
  }

  handleSelectCity(city: FullCity) {
    const polygon = new ymaps.Polygon(
      this.buildCoordinates(city.border),
      {},
      {
        fillColor: '#FF000088',
        strokeColor: '#FF0000FF',
        opacity: 0.3,
        strokeWidth: 2,
      }
    );
    if (this.map) {
      this.map.geoObjects.removeAll();
      this.map.geoObjects.add(polygon);
    }

    this.position.center = city.center.coordinates.reverse();
    this.map?.setBounds(
      [
        [city.south, city.west],
        [city.north, city.east],
      ],
      { preciseZoom: true }
    );
  }

  onReady(event: any) {
    console.log(event);
  }
}
