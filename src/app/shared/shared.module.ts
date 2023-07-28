import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteComponent } from './components/favorite/favorite.component';
import { InputFormatDirective } from './services/input-format.directive';
import { SummaryPipe } from './services/summary.pipe';
import { FormInputErrorComponent } from './components/form-input-error/form-input-error.component';
import { ErrorNotificationService } from 'sharedServices/error.notification';
import { LoginButtonComponent } from './components/buttons/login-button.component';
import { SignupButtonComponent } from './components/buttons/signup-button.component';
import { LogoutButtonComponent } from './components/buttons/logout-button.component';
import { OutsideClickDirective } from 'sharedServices/outside-click.directive';
import { BrowserModule } from '@angular/platform-browser';
import { postExpireDatePipe } from 'sharedServices/postExpireDate.pipe';
import { postPastTense } from 'sharedServices/postPastTense.pipe';
import { PublicApiService } from 'sharedServices/public-api.service';
import { GetSubscriptionComponent } from './components/get-subscription/get-subscription.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
  ],
  declarations: [
    FavoriteComponent,
    InputFormatDirective,
    OutsideClickDirective,
    SummaryPipe,
    postExpireDatePipe,
    postPastTense,
    FormInputErrorComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
    GetSubscriptionComponent,
  ],

  providers: [
    ErrorNotificationService,
    PublicApiService
  ],

  exports: [
    FavoriteComponent,
    InputFormatDirective,
    OutsideClickDirective,
    SummaryPipe,
    postExpireDatePipe,
    postPastTense,
    FormInputErrorComponent,
    GetSubscriptionComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent
  ]
})
export class SharedModule { }
