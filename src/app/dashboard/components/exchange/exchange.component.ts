import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';

import { ExchangeApiService } from '../../services/exchange.api.service';

import { AppError } from 'sharedServices/Errors/app-error';

import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';

import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
import { Subject } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  animations: [ fade ]
})

export class ExchangeComponent implements OnInit {
  exchange$ = this.store.select(selectExchange)
  currentPaginationFilters: Subject<Object> = new Subject<Object>();
  nearbyFreightsLoading: boolean = false;
  havePOSTPermission: boolean = false;

  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkSubscription();
  }

  checkSubscription() {
    this.authService.user$.subscribe(user => {
      let subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      console.log(subscription);
      if(subscription == 'shipper' || subscription == 'forwarder') this.havePOSTPermission = true;
    })
  }

  nearbyFreights() {
    let nearbyRange = 400;
    this.nearbyFreightsLoading = true;
    navigator.geolocation.getCurrentPosition((loc) => {
      let geoLocation = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      }
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
    let eventValue = Object.values(eventArgs)[0];

    this.service.likePost(postId, eventValue, this.session.ID)
      .subscribe({
        next: () => {
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }));
        },
        error: (error: AppError) => { throw error; }
      })
  }
}
