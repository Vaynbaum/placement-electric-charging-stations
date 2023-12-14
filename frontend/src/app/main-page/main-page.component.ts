import { SettingsService } from './../shared/services/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  stats = [
    { value: '8К+', info: 'городов', icon: 'location_city' },
    { value: '1.4К+', info: 'заправок', icon: 'local_gas_station' },
    { value: '189К+', info: 'парковок', icon: 'local_parking' },
  ];

  headerSource = 'Источники данных';
  sources = [
    {
      ava: '../../assets/osrm_logo.png',
      title: 'Open Street Map',
      subtitle: 'Города, парковки',
      image: '../../assets/osrm_example.png',
    },
    {
      ava: '../../assets/oc_logo.png',
      title: 'Open Chargers',
      subtitle: 'Электрозаправки',
      image: '../../assets/oc_example.png',
    },
    {
      ava: '../../assets/yandex_logo.png',
      title: 'Яндекс API',
      subtitle: 'Карта',
      image: '../../assets/yandex_example.png',
    },
    {
      ava: '../../assets/worldpop_logo.png',
      title: 'WorldPop Hub',
      subtitle: 'Плотность населения',
      image: '../../assets/worldpop_example.png',
    },
  ];
}
