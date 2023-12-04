import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseItems } from '../models/response.model';
import { Observable } from 'rxjs';
import { EVStation } from '../models/evCharge.model';

const URL = `${environment.DB_URL}/infrastructure`;

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
    if (region_id) params.region_id  = region_id;

    return this.http.get<ResponseItems<EVStation>>(`${URL}/ev_chargers/all`, {
      params: { ...params },
    });
  }
}
