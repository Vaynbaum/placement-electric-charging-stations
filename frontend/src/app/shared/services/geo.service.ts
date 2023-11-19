import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FullCity } from '../models/city.model';
import { ResponseItems } from '../models/response.model';
import { Observable } from 'rxjs';

const URL = `${environment.DB_URL}/geo`;

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  constructor(private http: HttpClient) {}

  addFirstSymbQuery(config: any) {
    if (!config.flag) {
      config.url += '?';
      config.flag = true;
    }
    return config;
  }

  addQueryParams(config: any, params: any, nameParams: string) {
    if (params) {
      this.addFirstSymbQuery(config);
      config.url += `${nameParams}=${params}&`;
    }
  }

  GetAllCities(
    is_top?: boolean,
    substr?: string
  ): Observable<ResponseItems<FullCity>> {
    let config = { url: `${URL}/cities/all`, flag: false };
    this.addQueryParams(config, is_top, 'is_top');
    this.addQueryParams(config, substr, 'substr');
    return this.http.get<ResponseItems<FullCity>>(config.url);
  }
}
