import { YaReadyEvent } from 'angular8-yandex-maps';
import { FullCity } from '../shared/models/city.model';
import { SettingsService } from './../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';
import { EVStation } from '../shared/models/evCharge.model';

interface PlacemarkConstructor {
  geometry: number[];
  properties: ymaps.IPlacemarkProperties;
  options: ymaps.IPlacemarkOptions;
}

@Component({
  selector: 'app-map',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements OnInit {
  constructor(public settings: SettingsService) {}
  selectedCity: any = null;
  currentPolygon: any = null;
  currentEVs: any[] = [];

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

  buildCoordinates(border: any) {
    let coords = border.coordinates;
    this.reversePolygon(coords);
    return coords;
  }

  randomColor = (): string => {
    let result = '';
    for (let i = 0; i < 6; ++i) {
      const value = Math.floor(16 * Math.random());
      result += value.toString(16);
    }
    return '#' + result;
  };

  handleGetEVs(evs: EVStation[] | null) {
    if (this.map) {
      this.map?.geoObjects.removeAll();
      this.currentEVs = [];
      this.map.geoObjects.add(this.currentPolygon);

      if (evs) {
        evs.forEach((ev) => {
          const polygon = new ymaps.Placemark(
            ev.center.coordinates.reverse(),
            {
              balloonContentBody: [
                '<address>',
                `<strong>${ev.address.Title}</strong>`,
                '</address>',
              ].join(''),
            },
            {
              iconColor: `${this.randomColor()}`,
            }
          );
          this.currentEVs.push(polygon);
          this.map?.geoObjects.add(polygon);
        });
      }
    }
  }

  handleSelectCity(city: FullCity) {
    if (city.border.type == 'MultiPolygon') {
      //@ts-ignore
      let coords = [];
      city.border.coordinates.forEach((border) => {
        coords.push(border[0]);
      });
      //@ts-ignore
      city.border.coordinates = coords;
    }

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
    this.currentPolygon = polygon;

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
}
