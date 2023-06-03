/* App dependencies */
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

/* Mock Backend */
import { MockBackendInterceptor } from './mock-backend';

/* Components */
import { AppComponent } from './app.component';

/* Services */
import { AuthService } from './shared/services/auth.service';
import { ExchangeNotificationsService } from 'sharedServices/exchange.notifications.service';

/* Global Error Handler */
import { AppErrorHandler } from './shared/services/ap-error-handler';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WildCardRouteModule } from './wild-card-route.module';
import { StoreModule } from '@ngrx/store';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

import {  ExchangeNotificationReducer,
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
          }
        ],
      }
    }),
    StoreModule.forRoot({
      exchange: exchangeReducer,
      singlePost: singlePostReducer,
      exchangeNotifications: ExchangeNotificationReducer,
      currentPage: currentPageReducer
    }),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    AdminModule,
    DashboardModule,
    WildCardRouteModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor, //MockBackendInterceptor,
      multi: true
    },
    AuthService,
    ExchangeNotificationsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
