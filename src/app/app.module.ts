/* App dependencies */
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/* Mock Backend */
// import { MockBackendInterceptor } from './mock-backend';

/* Components */
import { AppComponent } from './app.component';

/* Services */
import { ExchangeNotificationsService } from 'sharedServices/exchange.notifications.service';

/* Global Error Handler */
import { AppErrorHandler } from './shared/services/ap-error-handler';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompanyModule } from './company/company.module';
import { WildCardRouteModule } from './wild-card-route.module';
import { StoreModule } from '@ngrx/store';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

import {  BidReducer, ExchangeNotificationReducer,
          currentPageReducer,
          exchangeReducer,
          singlePostReducer
} from './state/exchange.reducer';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...environment.auth0,
      cacheLocation: "localstorage",
      httpInterceptor: {
        allowedList: [
          {
            uri: environment.API_URL + '/*',
            tokenOptions: {
              authorizationParams: {
                ...environment.auth0.authorizationParams
              }
            }
          },
          {
            uri: environment.API_AUTH_URL + '/*',
            tokenOptions: {
              authorizationParams: {
                ...environment.auth0.authorizationParams
              }
            }
          }
        ],
      }
    }),
    StoreModule.forRoot({
      exchange: exchangeReducer,
      singlePost: singlePostReducer,
      exchangeNotifications: ExchangeNotificationReducer,
      currentPage: currentPageReducer,
      bid: BidReducer
    }),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    AdminModule,
    DashboardModule,
    CompanyModule,
    WildCardRouteModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor, //MockBackendInterceptor,
      multi: true
    },
    ExchangeNotificationsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
