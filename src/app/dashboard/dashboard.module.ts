import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { ExchangeService } from './services/exchange.service';
import { ExchangePostService } from './services/exchange-post.service';
import { ReactiveFormsModule } from '@angular/forms';

import { ExchangeComponent } from './components/exchange/exchange.component';
import { ExchangePostComponent } from './components/post/exchange-post.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { ExchangePost_PublicService } from './services/exchange-post.public.service';
import { provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  providers: [
    ExchangeService,
    ExchangePostService,
    ExchangePost_PublicService,
    provideAnimations()
  ],

  declarations: [
    ExchangeComponent,
    ExchangePostComponent,
  ],

  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'exchange', canActivate: [AuthGuard], component: ExchangeComponent },
      { path: 'exchange/:id', component: ExchangePostComponent},
    ]),
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
