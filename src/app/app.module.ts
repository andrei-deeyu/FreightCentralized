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


import { exchangeReducer } from './state/exchange.reducer';
// import { collectionReducer } from './state/collection.reducer';
// import { notificationsReducer } from './state/notifications.reducer';

import { StoreModule } from '@ngrx/store';


// import { BookListComponent } from './book-list/book-list.component';
// import { BookCollectionComponent } from './book-collection/book-collection.component';
// import { NotificationsComponent } from './notifications/notifications.component';



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
      exchange: exchangeReducer
      // notifications: notificationsReducer,
    }),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    AdminModule,
    DashboardModule,
    WildCardRouteModule
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
