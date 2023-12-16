import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseItems } from '../models/response.model';
import { Observable } from 'rxjs';
import { EVStation, EVStationPredict } from '../models/evstation.model';
import { Parking } from '../models/parking.model';

const URL = `${environment.DB_URL}/infrastructure`;
const URL_P = `${environment.PREDICT_URL}/infrastructure`;

@Injectable({
  providedIn: 'root',
})
export class InfrastructureService {
  constructor(private http: HttpClient) {}

  GetAllEVStations(
    city_id?: number,
    region_id?: number
  ): Observable<ResponseItems<EVStation>> {
    let params: any = {};
    if (city_id) params.city_id = city_id;
    if (region_id) params.region_id = region_id;

    return this.http.get<ResponseItems<EVStation>>(`${URL}/ev_chargers/all`, {
      params: { ...params },
    });
  }

  GetAllParkings(city_id?: number): Observable<ResponseItems<Parking>> {
    let params: any = {};
    if (city_id) params.city_id = city_id;

    return this.http.get<ResponseItems<Parking>>(`${URL}/parkings/all`, {
      params: { ...params },
    });
  }

  GetAllPredictEVs(
    city_id?: number,
    hour?: number,
    year?: number,
    power?: number,
    cost_service?: number,
    cost_ev?: number,
    time_charge_hour?: number
  ): Observable<ResponseItems<EVStationPredict>> {
    let params: any = {};
    if (city_id) params.city_id = city_id;
    if (hour) params.hour = hour;
    if (year) params.year = year;
    if (power) params.power = power;
    if (cost_service) params.cost_service = cost_service;
    if (cost_ev) params.cost_ev = cost_ev;
    if (time_charge_hour) params.time_charge_hour = time_charge_hour;

    return this.http.get<ResponseItems<EVStationPredict>>(
      `${URL_P}/ev_chargers/predict`,
      {
        params: { ...params },
      }
    );
  }
}
