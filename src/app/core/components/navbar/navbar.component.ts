import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class NavbarComponent implements OnInit {
  isMobile: boolean;
  isAuthenticated$ = this.authService.isAuthenticated$
  user$ = this.authService.user$;
  isAdmin = false;
  canPostFreight = false;
  isExpanded = false;
  notifications$ = this.store.select(selectExchangeNotifications);
  openSearch = false;
  @HostListener('window:resize', ['$event']) getScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor(
    private authService: AuthService,
    @Inject(DOCUMENT) private doc: Document,
    public router: Router,
    private store: Store
  ) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.isAdmin = user?.[`${environment.idtoken_namespace}app_metadata`]?.admin;
      const subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      if(subscription == 'shipper' || subscription == 'forwarder') {
        this.canPostFreight = true;
      }
    })
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
