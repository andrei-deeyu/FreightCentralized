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

@NgModule({
  providers: [
    ExchangeService,
    ExchangePostService,
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
      { path: 'exchange', component: ExchangeComponent },
      { path: 'exchange/:id', component: ExchangePostComponent},
    ]),
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
