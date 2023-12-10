import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { FullCity } from '../../models/city.model';
import { SelectInput } from '../../models/input.model';
import { ResponseItems } from '../../models/response.model';
import { GeoService } from '../../services/geo.service';
import { InfrastructureService } from '../../services/infrastructure.service';
import { showMessage } from '../../common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  hour = 3;

  hourControl = new FormControl(this.hour, [
    Validators.required,
    Validators.max(24),
    Validators.min(0),
  ]);

  @Output() selectedCity = new EventEmitter<any>();
  @Output() getEVs = new EventEmitter<any>();
  @Output() getParkingsEvent = new EventEmitter<any>();
  @Output() getEVPredictEvent = new EventEmitter<any>();
  cityInput: SelectInput = {
    type: 'text',
    label: LOADING_CITY,
    formControl: this.cityControl,
    items: [],
    placeholder: 'Введите название',
  };

  constructor(
    private _snackBar: MatSnackBar,
    private geoService: GeoService,
    private infrastructureService: InfrastructureService
  ) {}

  toggleEV = {
    flag: false,
    name: 'Существующие заправки',
  };
  toggleParking = {
    flag: false,
    name: 'Парковки',
  };
  buttonPredictEVName = 'Предложить заправки';

  executeAction(slide: any) {
    slide.action(slide);
  }

  getExistEVs(slide: any) {
    if (this.currentCity) {
      if (slide.flag) {
        this.infrastructureService
          .GetAllEVStations(this.currentCity.id)
          .subscribe(
            (evs) => {
              this.getEVs.emit(evs.items);
            },
            (err) => {
              if (err.status == 404)
                showMessage(
                  this._snackBar,
                  'Существующих заправок не найдено 😞'
                );
              else
                showMessage(this._snackBar, 'Не удалось получить заправки 😞');
            }
          );
      } else {
        this.getEVs.emit(null);
      }
    }
  }
  getEVPredict() {
    if (this.currentCity) {
      showMessage(this._snackBar, 'Идет вычисление...');
      this.infrastructureService
        .GetAllPredictEVs(this.currentCity.id, this.hour)
        .subscribe(
          (evs: any) => {
            if (evs.length > 0)
              showMessage(this._snackBar, 'Вычисление завершено');
            else
              showMessage(
                this._snackBar,
                'Нет необходимости в новых заправках'
              );
            this.getEVPredictEvent.emit(evs);
          },
          (e) => {
            console.log(e);
            if (e.error && e.error.detail)
              showMessage(this._snackBar, e.error.detail);
            else
              showMessage(this._snackBar, 'Не удалось вычислить заправки 😞');
          }
        );
    }
  }

  getParkings(slide: any) {
    if (this.currentCity) {
      if (slide.flag) {
        showMessage(this._snackBar, 'Идет поиск парковок...');
        this.infrastructureService
          .GetAllParkings(this.currentCity.id)
          .subscribe(
            (evs: any) => {
              this.getParkingsEvent.emit(evs.items);
            },
            (err) => {
              if (err.status == 404)
                showMessage(this._snackBar, 'Парковки не найдены 😞');
              else
                showMessage(this._snackBar, 'Не удалось получить парковки 😞');
            }
          );
      } else {
        this.getParkingsEvent.emit(null);
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
      this.toggleEV.flag = false;
      this.toggleParking.flag = false;
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
