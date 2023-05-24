/* App dependencies */
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterStateSnapshot } from '@angular/router';

/* Mock Backend */
import { MockBackendInterceptor } from './helpers/fake-backend';


/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SignupFormComponent } from './signup-form/signup-form.component';


/* Services */
import { AuthService } from './services/auth.service';
import { PostsService } from './services/posts.service';
import { PostService } from './services/post.service';


/* Common | Directives */
import { SummaryPipe } from './common/summary.pipe';
import { InputFormatDirective } from './common/input-format.directive';


/* Global Error Handler */
import { AppErrorHandler } from './common/ap-error-handler';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    SummaryPipe,
    FavoriteComponent,
    InputFormatDirective,
    SignupFormComponent,
    PostsComponent,
    HomeComponent,
    NavbarComponent,
    PostComponent,
    LoginComponent,
    AdminComponent,
    NoAccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: [ 'server.com/api/v1/function' ],
        // disallowedDomains: [']
      }
    })
  ],
  providers: [
    PostsService,
    PostService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockBackendInterceptor,
      multi: true
    },
    AppRoutingModule,
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
