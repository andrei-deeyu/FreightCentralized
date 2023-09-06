import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';
import { ExchangeApiService } from '../../services/exchange.api.service';
import { AppError } from 'sharedServices/Errors/app-error';
import { fade } from 'sharedServices/animations';
import { Subject } from 'rxjs';


@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  animations: [ fade ]
})

export class ExchangeComponent {
  exchange$ = this.store.select(selectExchange)
  currentPaginationFilters: Subject<object> = new Subject<object>();
  nearbyFreightsLoading = false;
  warningMessage = '';

  constructor (
    private service: ExchangeApiService,
    private store: Store,
  ) {}

  nearbyFreights() {
    const nearbyRange = 400;
    this.nearbyFreightsLoading = true;

    navigator.permissions.query({"name": "geolocation"})
    .then(permission => {
      if(permission.state !== 'granted') {
        this.warningMessage = 'You must allow geolocation to use nearby search'
        setTimeout(() => {
          this.warningMessage = '';
          this.nearbyFreightsLoading = false;
        }, 3000);
      }
    })

    navigator.geolocation.getCurrentPosition((loc) => {
      const geoLocation = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      }
      if(!geoLocation) return;

      this.service.getNearby(geoLocation, nearbyRange).subscribe({
        next: (result) => {
          this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({exchange: result}))
          this.nearbyFreightsLoading = false;
        },
        error: () => {
          this.nearbyFreightsLoading = false;
          throw new AppError();
        }
      })
    });
  }

  setPaginationFilters(event: object) {
    this.currentPaginationFilters.next(event);
  }
}