﻿import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { GetPlaces, SelectPlace } from '@app/modules/places/state/autocomplete.actions';
import { AutocompleteState } from '@app/modules/places/state/autocomplete.state';
import { SetDistance, SetLocation, SetRating, SetReviews } from '@app/modules/places/state/filter.actions';
import { FilterState, FilterStateModel } from '@app/modules/places/state/filter.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { GooglePlacesAutocomplete, GooglePlacesPlace, Place } from '../../models';
import { GooglePlacesService } from '../../services';
import { GetPlaces1 } from '@app/modules/places/state/places.actions';
import { PlacesState } from '@app/modules/places/state/places.state';

@Component({
  moduleId: module.id,
  selector: 'app-place-search',
  templateUrl: 'place-search.component.html',
  styleUrls: ['place-search.component.scss']
})
export class PlaceSearchComponent implements OnDestroy, OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  @Select(FilterState.filter) filter$: Observable<FilterStateModel>;
  @Select(AutocompleteState.items) items$: Observable<GooglePlacesAutocomplete[]>;
  @Select(AutocompleteState.selected) selected$: Observable<GooglePlacesPlace>;
  @Select(PlacesState.places) places$: Observable<Place[]>;

  public placeCtrl: FormControl = new FormControl();
  constructor(private store: Store, private googleService: GooglePlacesService) {}

  public ngOnInit() {
    this.placeCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        filter(value => typeof value === 'string' && value.trim() !== ''),
        switchMap(value => this.store.dispatch(new GetPlaces(value)))
      )
      .subscribe(_ => true);

    this.selected$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => !!value),
        switchMap(value => this.store.dispatch(new SetLocation(value.location)))
      )
      .subscribe(_ => true);

    this.places$.subscribe(x => console.log(x));
    this.setCurrentPosition();
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  public displayPlace(place?: GooglePlacesAutocomplete): string | undefined {
    return place ? place.description : undefined;
  }

  public selectPlace(event: MatAutocompleteSelectedEvent) {
    this.store.dispatch(new SelectPlace((<GooglePlacesAutocomplete>event.option.value).id));
  }

  public changeDistanceHandler(value: number) {
    this.store.dispatch(new SetDistance(value));
  }
  public changeRatingHandler(value: number) {
    this.store.dispatch(new SetRating(value));

    this.store.dispatch(new GetPlaces1());
  }
  public changeReviewsHandler(value: number) {
    this.store.dispatch(new SetReviews(value));
  }

  private setCurrentPosition() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const location = new Location(position.coords.latitude, position.coords.longitude);
    //     this.store.dispatch(new filterActions.SetLocationAction(location));
    //   });
    // }
  }
}
