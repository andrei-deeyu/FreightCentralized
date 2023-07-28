import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { AuthApiService } from '../../../shared/services/auth.api.service';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  changingSubscription: boolean = false;
  user$ = this.authService.user$;
  code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)));
  email_verification_resent: boolean = false;
  emailToOpen:string = '';
  editing:boolean = false;
  newName: string = '';
  user_subscription: string = '';

  constructor(public authService: AuthService, private store: Store, private service: AuthApiService) { }

  ngOnInit() {
    this.user$.subscribe(user => {
      console.log(user)
      this.user_subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
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
          this.authService.loginWithRedirect({
            appState: {
              target: '/profile',
            },
          });
          this.editing = false;
        }
    })
  }
}

