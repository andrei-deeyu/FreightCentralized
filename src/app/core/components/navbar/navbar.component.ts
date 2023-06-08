import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { fadeOnOff, menuExpandedCollapsed } from 'sharedServices/animations';
import { ExchangeNotificationsActions } from 'src/app/state/exchange.actions';
import { selectExchangeNotifications } from 'src/app/state/exchange.selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [ menuExpandedCollapsed, fadeOnOff ]
})
export class NavbarComponent {
  isAuthenticated$ = this.authService.isAuthenticated$
  user$ = this.authService.user$;
  isAdmin: boolean = false;
  isExpanded: boolean = false;
  notifications$ = this.store.select(selectExchangeNotifications);

  constructor(
    private authService: AuthService,
    @Inject(DOCUMENT) private doc: Document,
    private store: Store
  ) {}

  ngOnInit() {
    this.user$.subscribe(user => this.isAdmin = user?.[`${environment.idtoken_namespace}app_metadata`]?.admin)
  }

  deleteNotification() {
    this.store.dispatch(ExchangeNotificationsActions.removeNotification());
  }

  handleLogout(): void {
    this.isExpanded = false;
    this.authService.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}
