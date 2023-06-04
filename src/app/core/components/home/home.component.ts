import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExchangeNotifications } from 'src/app/state/exchange.selectors';
import { ExchangeNotificationsActions } from 'src/app/state/exchange.actions';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { HomeService } from '../../services/home.service';

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
  code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)));
  email_verification_resent: boolean = false;
  emailToOpen:string = '';
  editing:boolean = false;
  newName: string = '';

  constructor(public authService: AuthService, private store: Store, private service: HomeService) { }

  ngOnInit() {
    this.user$.subscribe(user => {
      console.log(user)
      if(user) {
        let domain:string[] = user?.email?.split("@") ?? [''];
        if(domain[1].includes('gmail')) {
          this.emailToOpen = 'https://mail.google.com/';
        } else if(domain[1].includes('yahoo')) {
          this.emailToOpen = 'https://mail.yahoo.com/';
        }
      }
    })
  }

  resendEmailVerification() {
    this.service.resendVerification()
    .subscribe({
      next: (result: {[index: string]:Object}) => {
        console.log(result)
        if(result['status'] == 'pending')
          this.email_verification_resent = true;
        }
    })
  };

  openEmail() {
    if(this.emailToOpen) window.location.href = this.emailToOpen;
  }

  saveProfile() {
    this.service.saveProfile(this.newName)
    .subscribe({
      next: (result: {[index: string]:Object}) => {
        console.log(result)
        if(result['status'] == 'changed')
          console.log(result);
          this.authService.loginWithRedirect();
          this.editing = false;
        }
    })
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
