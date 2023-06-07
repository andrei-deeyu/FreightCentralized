import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ErrorNotificationService } from 'sharedServices/error.notification';
import { ExchangeNotificationsService } from 'sharedServices/exchange.notifications.service';
import { SessionService } from 'sharedServices/session.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuth0Loading$ = this.authService.isLoading$;
  errorNotification: string = '';
  showErrorNotification: boolean = false;

  constructor(
    private authService: AuthService,
    private exchangeNotificationsService: ExchangeNotificationsService,
    private session: SessionService,
    private errorNotificationService: ErrorNotificationService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit() {
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