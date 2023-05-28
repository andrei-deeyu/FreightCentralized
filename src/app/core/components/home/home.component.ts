import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Store } from '@ngrx/store';
import { selectNotification } from 'src/app/state/exchange.selectors';
import { NotificationActions } from 'src/app/state/exchange.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  notifications$ = this.store.select(selectNotification);
  name = '';
  eventCode = ''

  constructor(public authService: AuthService, private store: Store) { }

  deleteNotification() {
    this.store.dispatch(NotificationActions.removeNotification());
  }

  onKeyUp($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    if(target && $event.key == 'Enter') this.name = target.value;
    this.eventCode = $event.code;
  }
}
