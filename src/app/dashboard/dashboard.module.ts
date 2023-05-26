import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { ExchangePostComponent } from './components/post/exchange-post.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ExchangeService } from './services/exchange.service';
import { ExchangePostService } from './services/exchange-post.service';


@NgModule({
  providers: [
    ExchangeService,
    ExchangePostService
  ],

  declarations: [
    ExchangeComponent,
    ExchangePostComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'exchange', component: ExchangeComponent },
      { path: 'exchange/:id', component: ExchangePostComponent },
    ])
  ]
})
export class DashboardModule { }
