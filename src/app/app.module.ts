/* App dependencies */
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { ContractsModule } from './contracts/contracts.module';
import { StoreModule } from '@ngrx/store';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { WildCardRouteModule } from './wild-card-route.module';

import {  BidReducer, ContractNotificationReducer, ExchangeNotificationReducer,
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
      contractNotifications: ContractNotificationReducer,
      currentPage: currentPageReducer,
      bid: BidReducer
    }),
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    CoreModule,
    AdminModule,
    DashboardModule,
    CompanyModule,
    ContractsModule,
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
