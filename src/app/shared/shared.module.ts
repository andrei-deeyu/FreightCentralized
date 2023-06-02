import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteComponent } from './components/favorite/favorite.component';
import { InputFormatDirective } from './services/input-format.directive';
import { SummaryPipe } from './services/summary.pipe';
import { FormInputErrorComponent } from './components/form-input-error/form-input-error.component';
import { ErrorNotificationService } from 'sharedServices/error.notification';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FavoriteComponent,
    InputFormatDirective,
    SummaryPipe,
    FormInputErrorComponent,
  ],

  providers: [
    ErrorNotificationService
  ],

  exports: [
    FavoriteComponent,
    InputFormatDirective,
    SummaryPipe,
    FormInputErrorComponent
  ]
})
export class SharedModule { }
