import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';

import { ExchangeApiService } from '../../services/exchange.api.service';

import { AppError } from 'sharedServices/Errors/app-error';

import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';

import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
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
  isMobile: boolean;
  warningMessage = '';

  @HostListener('window:resize', ['$event']) getScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService,
  ) {
    this.isMobile = window.innerWidth <= 768;
  }

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

  onFavoriteChanged(postId: string, eventArgs: FavoriteChangedEventArgs, ) {
    const eventValue = Object.values(eventArgs)[0];

    this.service.likePost(postId, eventValue, this.session.ID)
      .subscribe({
        next: () => {
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }));
        },
        error: (error: AppError) => { throw error; }
      })
  }
}
