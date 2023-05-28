/* App dependencies */
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

/* Mock Backend */
import { MockBackendInterceptor } from './mock-backend';

/* Components */
import { AppComponent } from './app.component';

/* Services */
import { AuthService } from './shared/services/auth.service';

/* Global Error Handler */
import { AppErrorHandler } from './shared/services/ap-error-handler';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WildCardRouteModule } from './wild-card-route.module';


export function tokenGetter() {
  return localStorage.getItem('token');
}


import { exchangeReducer, singlePostReducer } from './state/exchange.reducer';
// import { notificationsReducer } from './state/notifications.reducer';

import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: [ 'server.com/api/v1/function' ],
        // disallowedDomains: [']
      }
    }),
    StoreModule.forRoot({
      exchange: exchangeReducer,
      singlePost: singlePostReducer
      // notifications: notificationsReducer,
    }),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    AdminModule,
    DashboardModule,
    WildCardRouteModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockBackendInterceptor,
      multi: true
    },

    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
