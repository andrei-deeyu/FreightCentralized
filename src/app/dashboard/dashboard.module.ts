import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { ExchangeApiService } from './services/exchange.api.service';
import { PostApiService } from './services/post.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExchangeComponent } from './components/exchange/exchange.component';
import { PostComponent } from './components/post/post.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { PostPublicApiService } from './services/post.public-api.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { CreatePostRoutesComponent } from './components/create-post-routes/create-post-routes.component';
import { ExchangeFiltersComponent } from './components/exchange-filters/exchange-filters.component';
import { PostBidsComponent } from './components/post-bids/post-bids.component';
import { PostBidsService } from './services/post-bids.api.service';
import { MatSliderModule } from '@angular/material/slider';
import { MyPostsComponent } from './components/my-posts/my-posts.component';


@NgModule({
  providers: [
    ExchangeApiService,
    PostApiService,
    PostPublicApiService,
    PostBidsService,
    provideAnimations(),
    PaginationComponent
  ],

  declarations: [
    ExchangeComponent,
    PostComponent,
    PaginationComponent,
    CreatePostComponent,
    CreatePostRoutesComponent,
    ExchangeFiltersComponent,
    PostBidsComponent,
    MyPostsComponent,
  ],

  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    MatSliderModule,
    RouterModule.forChild([
      { path: 'exchange', canActivate: [AuthGuard], component: ExchangeComponent },
      { path: 'exchange/create-post', canActivate: [AuthGuard], component: CreatePostComponent },
      { path: 'exchange/:id', component: PostComponent},
      { path: 'my-freights', canActivate: [AuthGuard], component: MyPostsComponent }
    ]),
    ReactiveFormsModule,
  ],
})
export class DashboardModule { }
