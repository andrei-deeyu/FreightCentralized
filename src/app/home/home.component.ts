import { Component } from '@angular/core';
import { FavoriteChangedEventArgs } from '../favorite/favorite.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  name = '';
  eventCode = ''

  constructor(public authService: AuthService) {

  }

  onKeyUp($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement;
    if(target && $event.key == 'Enter') this.name = target.value;
    this.eventCode = $event.code;
  }

  onFavoriteChanged(eventArgs: FavoriteChangedEventArgs) {
    console.log(eventArgs)
  }
}
