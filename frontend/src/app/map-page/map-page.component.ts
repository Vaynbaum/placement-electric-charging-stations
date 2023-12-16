import { YaReadyEvent } from 'angular8-yandex-maps';
import { FullCity } from '../shared/models/city.model';
import { SettingsService } from './../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';
import { EVStation, EVStationPredict } from '../shared/models/evstation.model';
import { Parking } from '../shared/models/parking.model';

const COST_DEPT =
  'Окупить электрозаправку не получится без дополнительного источника финансирования';

@Component({
  selector: 'app-map',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements OnInit {
  constructor(public settings: SettingsService) {}
  selectedCity: any = null;
  currentPolygon: any = null;
  currentEVsCluster: any = null;
  currentParkingsCluster: any = null;
  currentEVPredict: any[] = [];

  defaultPosition = { center: [52.289588, 104.280606] };
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
      if (this.currentParkingsCluster)
        this.map.geoObjects.add(this.currentParkingsCluster);

      if (evs) {
        evs.forEach((ev) => {
          const polygon = new ymaps.Placemark(
            [ev.coord.latitude, ev.coord.longitude],
            {
              balloonContentBody: `<div>
              <p>Время работы заправки за день: ${ev.value} ч. / ${Math.round(
                (ev.value / 24) * 100
              )}%</p>

              ${
                ev.pay_back
                  ? `<p>Срок окупаемости электрозаправки: ${ev.pay_back} г. </p>`
                  : COST_DEPT
              }

              <p>Количество заряжаемых машин в день: ${ev.count_cars} </p>

              <p>Предложенная электрозаправка (все значения являются расчетными)</p>
            </div>`,
            },
            {
              // blue
              iconColor: '#FF0000',
              preset: 'islands#RedCircleDotIcon',
            }
          );

          this.currentEVPredict.push(polygon);
          this.map?.geoObjects.add(polygon);
        });
      }

      if (this.currentEVsCluster)
        this.map.geoObjects.add(this.currentEVsCluster);
    }
  }

  handleGetParkings(parkings: Parking[] | null) {
    if (this.map) {
      let clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedYellowClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
      });
      this.map?.geoObjects.removeAll();
      this.map.geoObjects.add(this.currentPolygon);

      if (parkings) {
        parkings.forEach((parking) => {
          const polygon = new ymaps.Placemark(
            parking.center.coordinates.reverse(),
            {
              balloonContentBody: `<div>
              ${
                parking.description
                  ? `<strong>${parking.description}</strong>`
                  : ''
              }
              <p>Парковка</p>
            </div>`,
            },
            {
              // yellow
              iconColor: '#ffd54f',
              preset: 'islands#YellowCircleDotIcon',
            }
          );
          clusterer.add(polygon);
        });
      }
      this.currentParkingsCluster = clusterer;
      this.map?.geoObjects.add(clusterer);
      this.currentEVPredict.forEach((e) => {
        //@ts-ignore
        this.map.geoObjects.add(e);
      });
      if (this.currentEVsCluster)
        this.map.geoObjects.add(this.currentEVsCluster);
    }
  }

  displayConnections(connections: any[]) {
    let li = '';
    connections.forEach((connect) => {
      const img_path = this.defineTypeConnectionImagePath(
        connect.connection_type.Title
      );
      li += `<li style="display: flex; align-items: center; column-gap: 10px"><img src="../../assets/connectors/${img_path}" width="30px" height="30px">Тип: ${
        connect.connection_type.Title
      }, ${connect.power_kw} кВт.
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

  defineTypeConnectionImagePath(str: string) {
    let res = 'Unknown.svg';
    const str_p = str.toLowerCase();
    if (str_p.includes('type 1')) {
      if (str_p.includes('j1772')) {
        res = 'Type1_J1772.svg';
      } else if (str_p.includes('ccs')) {
        res = 'Type1_CCS.svg';
      }
    } else if (str_p.includes('type 2')) {
      if (str_p.includes('socket')) {
        res = 'Type2_socket.svg';
      } else if (str_p.includes('ccs')) {
        res = 'Type2_CCS.svg';
      } else if (str_p.includes('tethered')) {
        res = 'Type2_tethered.svg';
      }
    } else if (str_p.includes('schuko')) {
      res = 'schuko.svg';
    } else if (str_p.includes('tesla')) {
      res = 'Tesla-hpwc-model-s.svg';
    } else if (str_p.includes('chademo')) {
      res = 'Chademo_type4.svg';
    } else if (str_p.includes('type 3')) {
      res = 'Type3c.svg';
    }
    return res;
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
              <strong>${a.title}</strong>
              ${a.address ? '<p>Адрес: ' + a.address + '</p>' : ''}
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
      let clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
      });
      this.map.geoObjects.add(this.currentPolygon);
      if (this.currentParkingsCluster)
        this.map.geoObjects.add(this.currentParkingsCluster);
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
              // blue
              iconColor: '#9575cd',
            }
          );
          clusterer.add(polygon);
        });
      }
      this.currentEVsCluster = clusterer;
      this.map?.geoObjects.add(clusterer);
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

    let polygon = null;
    if (city.border.type == 'Point') {
      polygon = new ymaps.Placemark(
        city.border.coordinates.reverse(),
        {},
        {
          // blue
          iconColor: '#FF000088',
        }
      );
    } else {
      polygon = new ymaps.Polygon(
        this.buildCoordinates(city.border),
        {},
        {
          fillColor: '#FF000088',
          strokeColor: '#FF0000FF',
          opacity: 0.3,
          strokeWidth: 2,
        }
      );
    }
    this.currentPolygon = polygon;
    this.currentEVPredict = [];

    if (this.map) {
      this.currentEVsCluster = null;
      this.currentParkingsCluster = null;
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
