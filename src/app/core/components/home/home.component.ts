import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExchangeNotifications } from 'src/app/state/exchange.selectors';
import { ExchangeNotificationsActions } from 'src/app/state/exchange.actions';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  notifications$ = this.store.select(selectExchangeNotifications);
  name = '';
  eventCode = ''
  user$ = this.authService.user$;
  code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)))

  constructor(public authService: AuthService, private store: Store) { }

  ngOnInit() {
    this.user$.subscribe(user => console.log(user))
  }

  deleteNotification() {
    this.store.dispatch(ExchangeNotificationsActions.removeNotification());
  }

  onKeyUp($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    if(target && $event.key == 'Enter') this.name = target.value;
    this.eventCode = $event.code;
  }
}
