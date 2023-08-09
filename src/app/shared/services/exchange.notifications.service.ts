import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Exchange, ExchangeMockup } from '@shared/models/exchange.model';
import { selectCurrentPage, selectExchange } from 'src/app/state/exchange.selectors';
import { RetryConfig, firstValueFrom, retry } from 'rxjs';
import { BidApiActions, ExchangeApiActions, ExchangeNotificationsActions } from 'src/app/state/exchange.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NoInternetConnection } from './Errors/no-internet-connection';
import { AuthService } from '@auth0/auth0-angular';


@Injectable({
  providedIn: 'root'
})
export class ExchangeNotificationsService {
  currentPage$ = this.store.select(selectCurrentPage);
  exchange$ = this.store.select(selectExchange);
  retryConfig: RetryConfig = {
    delay: 3000,
  };

  constructor(private store: Store, private router: Router, private authService: AuthService) {}

  validKeys(_data: Exchange) {
    function instanceOfExchange(object: any, element:any): object is Exchange {
      if(element === 'isLiked') return true;
      return element in object;
    }

    let ExchangeKeys = Object.keys(ExchangeMockup);
    let result:Array<boolean> = [];

    ExchangeKeys.forEach((key) => {
      result.push(instanceOfExchange(_data, key))
    })

    if( result.includes(false) ) return false;
    else return true;
  }

  async connect(sessionID: string) {
    let user = await firstValueFrom(this.authService.user$)
    if( !user ) return;

    let userId: string | undefined = user?.sub?.split('auth0|')[1]
    let socket:WebSocketSubject<any> = webSocket(environment.WS_URL + '?' + userId + '/' + sessionID);

    socket.pipe(
      retry(this.retryConfig)
    ).subscribe({
      next: async ( data: any ) => {
        console.log(data)
        if( data._id && this.validKeys( data ) ) {
          let _currentPage = await firstValueFrom(this.currentPage$)

          if( this.router.url == '/exchange' && _currentPage.pageActive === 1) {
            data.new = true;
            this.store.dispatch(ExchangeApiActions.addPost({ post: data }));
          }
          this.store.dispatch(ExchangeNotificationsActions.addNotification({ post: data }))
        }

        if( data.removed ) {
          let postId = data.removed;
          this.store.dispatch(ExchangeApiActions.removePost({ postId }))
        }

        if( data.liked ) {
          let postId = data.liked;
          let eventValue = data.eventValue;
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }))
        }

        if(this.router.url == '/exchange/' + data.postId) {
          if(data.price && data.postId) {
            this.store.dispatch(BidApiActions.addBid({ bid: data }))
          }
          if(data.removedBid) {
            let bidId = data.removedBid;
            this.store.dispatch(BidApiActions.removeBid({ bidId }))
          }
        }
      },
      error: ( err ) => { throw new NoInternetConnection(err) },
      complete: () => console.log('logged out from sockets')
    })
  }
}