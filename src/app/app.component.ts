import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ErrorNotificationService } from 'sharedServices/error.notification';
import { ExchangeNotificationsService } from 'sharedServices/exchange.notifications.service';
import { SessionService } from 'sharedServices/session.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuth0Loading$ = this.authService.isLoading$;
  isAuthenticated = this.authService.isAuthenticated$
  userLoaded: boolean = false;
  errorNotification: string = '';
  showErrorNotification: boolean = false;
  profileSetup: boolean = false;
  email_verified: boolean | undefined = false;

  constructor(
    private authService: AuthService,
    private exchangeNotificationsService: ExchangeNotificationsService,
    private session: SessionService,
    private errorNotificationService: ErrorNotificationService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit() {
    this.checkUser();
    this.listenToErrorNotifications();
  }

  checkUser() {
    this.authService.user$.subscribe(user => {
      if(user?.sub) this.userLoaded = true;

      let haveSubscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      if(haveSubscription) this.profileSetup = true;

      this.email_verified = user?.email_verified;
    })
  }

  listenToErrorNotifications() {
    this.exchangeNotificationsService.connect(this.session.ID);

    this.errorNotificationService
      .errorNotification$
      .subscribe(( message ) => {
        this.errorNotification = message;
        this.showErrorNotification = true;
        this.cdr.detectChanges();
      });
  }
}