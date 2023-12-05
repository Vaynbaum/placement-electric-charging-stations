import { YaReadyEvent } from 'angular8-yandex-maps';
import { FullCity } from '../shared/models/city.model';
import { SettingsService } from './../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';
import { EVStation, EVStationPredict } from '../shared/models/evstation.model';
import { Parking } from '../shared/models/parking.model';

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
currentParkings: any[] = [];
  currentEVPredict: any[] = [];

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

  handleEVPredict(evs: EVStationPredict[] | null) {
    if (this.map) {
      this.map?.geoObjects.removeAll();
      this.currentEVPredict = [];
      this.map.geoObjects.add(this.currentPolygon);
      this.currentParkings.forEach((p) => {
        //@ts-ignore
        this.map.geoObjects.add(p);
      });

      if (evs) {
        evs.forEach((ev) => {
          const polygon = new ymaps.Placemark(
            [ev.coord.latitude, ev.coord.longitude],
            {
              balloonContentBody: `<div>
              <p>Предположительное время работы заправки за день: ${
                ev.value
              } ч. / ${Math.round((ev.value / 24) * 100)}%</p>
              <p>Предложенная электрозаправка</p>
            </div>`,
            },
            {
              // blue
              iconColor: '#FF0000',
              // preset: 'islands#greenCircleDotIcon',
            }
          );

          this.currentEVPredict.push(polygon);
          this.map?.geoObjects.add(polygon);
        });
      }

      this.currentEVs.forEach((ev) => {
        //@ts-ignore
        this.map.geoObjects.add(ev);
      });
    }
  }

  handleGetParkings(parkings: Parking[] | null) {
    if (this.map) {
      this.map?.geoObjects.removeAll();
      this.currentParkings = [];
      this.map.geoObjects.add(this.currentPolygon);

      if (parkings) {
        parkings.forEach((parking) => {
          const polygon = new ymaps.Placemark(
            parking.center.coordinates.reverse(),
            {
              balloonContentBody: `<div>
              <strong>${parking.description}</strong>
              <p>Парковка</p>
            </div>`,
            },
            {
              // blue
              iconColor: '#0000FF',
              preset: 'islands#greenCircleDotIcon',
            }
          );
          this.currentParkings.push(polygon);
          this.map?.geoObjects.add(polygon);
        });
      }

      this.currentEVPredict.forEach((e) => {
        //@ts-ignore
        this.map.geoObjects.add(e);
      });
      this.currentEVs.forEach((ev) => {
        //@ts-ignore
        this.map.geoObjects.add(ev);
      });
    }
  }

  displayConnections(connections: any[]) {
    let li = '';
    connections.forEach((connect) => {
      li += `<li>Тип: ${connect.connection_type.Title}, ${connect.power_kw} кВт.
      ${
        connect?.current_type?.Description
          ? `(${connect.current_type.Description})`
          : ''
      }, ${connect.quantity} (количество)
      </li>`;
    });
    return `<ul>Порты:
      ${li}
    </ul>`;
  }

  content_exist_ev(ev: EVStation) {
    let a = ev.address;
    let t2 = a.ContactTelephone2;
    let t1 = a.ContactTelephone1;
    let u_t = '';
    if (ev.use_time) {
      u_t = `Время использования заправки сейчас: ${ev.use_time.toFixed(1)} ч.`;
    }
    return `<div>
              <strong>${a.Title}</strong>
              <p>Адрес:  ${a.StateOrProvince ? a.StateOrProvince + ', ' : ''}
              ${a.Town ? a.Town + ', ' : ''}
              ${a.AddressLine2 ? a.AddressLine2 + ', ' : ''}
              ${a.AddressLine1 ? a.AddressLine1 + ', ' : ''}
              ${a.Postcode ? a.Postcode : ''}
              </p>
              <p>${ev.cost ? `Стоимость: ${ev.cost}<br/>` : ''}
              ${
                ev?.status_type?.Title
                  ? `Статус: ${ev.status_type.Title}<br/>`
                  : ''
              }
              ${u_t}
              </p>
              <p>
              ${this.displayConnections(ev.сonnections.сonnections)}
              </p>
              <p>Существующая электрозаправка</p>
            </div>`;
  }

  handleGetEVs(evs: EVStation[] | null) {
    if (this.map) {
      this.map?.geoObjects.removeAll();
      this.currentEVs = [];
      this.map.geoObjects.add(this.currentPolygon);
this.currentParkings.forEach((p) => {
        //@ts-ignore
        this.map.geoObjects.add(p);
      });
      this.currentEVPredict.forEach((e) => {
        //@ts-ignore
        this.map.geoObjects.add(e);
      });

      if (evs) {
        evs.forEach((ev) => {
          const polygon = new ymaps.Placemark(
            ev.center.coordinates.reverse(),
            {
              balloonContentBody: this.content_exist_ev(ev),
            },
            {
              // green
              iconColor: '#008000',
            }
          );
          this.currentEVs.push(polygon);
          this.map?.geoObjects.add(polygon);
        });
      }
    }
  }

  handleSelectCity(city: FullCity) {
this.map?.geoObjects.removeAll();
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
