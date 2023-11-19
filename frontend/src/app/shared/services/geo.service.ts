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

  GetAllCities(
    is_top?: boolean,
    substr?: string
  ): Observable<ResponseItems<FullCity>> {
    let params: any = {};
    if (is_top) params.is_top = is_top;
    if (substr) params.substr = substr;
    return this.http.get<ResponseItems<FullCity>>(`${URL}/cities/all`, {
      params: { ...params },
    });
  }
}
