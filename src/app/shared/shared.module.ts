import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteComponent } from './components/favorite/favorite.component';
import { InputFormatDirective } from './services/input-format.directive';
import { SummaryPipe } from './services/summary.pipe';



@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FavoriteComponent,
    InputFormatDirective,
    SummaryPipe,
  ],

  providers: [

  ],

  exports: [
    FavoriteComponent,
    InputFormatDirective,
    SummaryPipe
  ]
})
export class SharedModule { }
