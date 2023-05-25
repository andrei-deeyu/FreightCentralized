import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteComponent } from './components/favorite/favorite.component';
import { InputFormatDirective } from './services/input-format.directive';
import { SummaryPipe } from './services/summary.pipe';

import { PostsService } from '../dashboard/services/posts.service';
import { PostService } from '../dashboard/services/post.service';



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
    PostsService,
    PostService
  ],

  exports: [
    FavoriteComponent,
    InputFormatDirective,
    SummaryPipe
  ]
})
export class SharedModule { }
