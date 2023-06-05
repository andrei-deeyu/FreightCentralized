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
    FormInputErrorComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent,
  ],

  providers: [
    ErrorNotificationService
  ],

  exports: [
    FavoriteComponent,
    InputFormatDirective,
    OutsideClickDirective,
    SummaryPipe,
    FormInputErrorComponent,
    LoginButtonComponent,
    SignupButtonComponent,
    LogoutButtonComponent
  ]
})
export class SharedModule { }
