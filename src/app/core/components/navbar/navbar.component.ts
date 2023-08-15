import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { mergeWith } from 'rxjs/operators';
import { fadeOnOff, menuExpandedCollapsed } from 'sharedServices/animations';
import { ContractNotificationsActions, ExchangeNotificationsActions } from 'src/app/state/exchange.actions';
import { selectContractNotifications, selectExchangeNotifications } from 'src/app/state/exchange.selectors';
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
  exchangeNotifications$ = this.store.select(selectExchangeNotifications);
  contractNotifications$ = this.store.select(selectContractNotifications);
  newNotification$ = this.exchangeNotifications$.pipe(mergeWith(this.contractNotifications$))

  newNotification = false;
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

  deleteExchangeNotification() {
    this.store.dispatch(ExchangeNotificationsActions.removeNotification());
  }

  deleteContractNotification() {
    this.store.dispatch(ContractNotificationsActions.removeNotification());
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
