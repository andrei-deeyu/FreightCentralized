import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExchangeNotifications } from 'src/app/state/exchange.selectors';
import { ExchangeNotificationsActions } from 'src/app/state/exchange.actions';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  notifications$ = this.store.select(selectExchangeNotifications);
  name = '';
  eventCode = ''

  constructor(private store: Store) { }

  ngOnInit() {}

  deleteNotification() {
    this.store.dispatch(ExchangeNotificationsActions.removeNotification());
  }

  onKeyUp($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    if(target && $event.key == 'Enter') this.name = target.value;
    this.eventCode = $event.code;
  }
}
