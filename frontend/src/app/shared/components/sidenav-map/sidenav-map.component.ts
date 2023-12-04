import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { FullCity } from '../../models/city.model';
import { SelectInput } from '../../models/input.model';
import { ResponseItems } from '../../models/response.model';
import { GeoService } from '../../services/geo.service';
import { InfrastructureService } from '../../services/infrastructure.service';

const LOADING_CITY = 'Загрузка городов...';
const SELECT_CITY = 'Выберите город';
const MIN_LENGTH_SUBSTR = 2;

@Component({
  selector: 'app-sidenav-map',
  templateUrl: './sidenav-map.component.html',
  styleUrls: ['./sidenav-map.component.scss'],
})
export class SidenavMapComponent {
  cityControl = new FormControl('');
  currentCity: any = null;

  @Output() selectedCity = new EventEmitter<any>();
  @Output() getEVs = new EventEmitter<any>();
  cityInput: SelectInput = {
    type: 'text',
    label: LOADING_CITY,
    formControl: this.cityControl,
    items: [],
    placeholder: 'Введите название',
  };

  constructor(
    private geoService: GeoService,
    private infrastructureService: InfrastructureService
  ) {}

  toggleEV = {
    flag: false,
    name: 'Отображать заправки',
  };
  toggleParking = {
    flag: false,
    name: 'Отображать парковки',
  };

  executeAction(slide: any) {
    slide.action(slide);
  }

  getExistEVs(slide: any) {
    if (this.currentCity) {
      if (slide.flag) {
        this.infrastructureService
          .GetAllEVStations(this.currentCity.id)
          .subscribe((evs) => this.getEVs.emit(evs.items));
      } else {
        this.getEVs.emit(null);
      }
    }
  }

  addCitiesToInput(items: FullCity[]) {
    this.cityInput.items = items;
    this.cityInput.label = SELECT_CITY;
    this.cityInput.values = this.compile_values(this.cityInput);
  }

  ngOnInit() {
    this.geoService
      .GetAllCities(true)
      .subscribe((result: ResponseItems<FullCity>) => {
        this.addCitiesToInput(result.items);
      });
  }
  private _filterValues(value: any, items: any[]) {
    let res = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    return res;
  }

  compile_values(input: SelectInput) {
    return input.formControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this._filterValues(value, input.items) : input.items.slice()
      )
    );
  }

  onKeydown(event: any) {
    if (event.key === 'Enter') {
      let city = this._filterValues(
        this.cityInput.formControl.value,
        this.cityInput.items
      )[0];
      this.selectCity(city);
    }
  }

  selectCity(city: FullCity) {
    if (
      city &&
      ((this.currentCity && city.name != this.currentCity.name) ||
        !this.currentCity)
    ) {
      this.currentCity = city;
      this.toggleEV.flag=false;
      this.toggleParking.flag=false;
      this.selectedCity.emit(city);
    }
  }

  onKeyup(input: SelectInput) {
    let v: string = input.formControl.value;
    if (v) {
      if (v.length > MIN_LENGTH_SUBSTR) {
        this.cityInput.label = LOADING_CITY;
        this.geoService
          .GetAllCities(false, v)
          .subscribe((result: ResponseItems<FullCity>) => {
            this.addCitiesToInput(result.items);
          });
      }
    }
  }
}
