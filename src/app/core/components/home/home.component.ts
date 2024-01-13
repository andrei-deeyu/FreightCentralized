import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Exchange } from '@shared/models/exchange.model';
import { PublicApiService } from 'sharedServices/public-api.service';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  brandName = environment.brandName;
  brandDesc = environment.brandDesc;
  brandDesc2 = environment.brandDesc2;
  githubRepo = environment.githubRepo;
  contactEmail = environment.contactEmail;
  backgroundImage = '../../assets/landing_page.jpg';
  exchange$ = this.store.select(selectExchange);
  isMobile: boolean;

  @HostListener('window:resize', ['$event']) getScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
  constructor(
    private store: Store,
    private service: PublicApiService
  ) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.service.getAllPublic()
    .subscribe(( exchange:Array<Exchange> ) => {
      console.log(exchange);
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  onFavoriteChanged() {
    console.log('You must be authenticated to like/unlike this post');
  }
}
