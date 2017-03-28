﻿import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppSettings } from '../core/appSettings';
import { PlaceDetails } from './models';

@Injectable()
export class PlacesService {

  constructor(private http: Http) {}

  search(latitude: number, longitude: number, distance: number, rating: number): Observable<PlaceDetails[]> {
    return this.http.get(`${AppSettings
        .itineraryApiBaseUrl}/places/search?lat=${latitude}&lng=${longitude}&distance=${distance}&rating=${rating}`)
      .map((response: Response) => <PlaceDetails[]>response.json());
  }
}
