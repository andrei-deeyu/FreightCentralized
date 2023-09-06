import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { ExchangeApiService } from '../../services/exchange.api.service';
import { Store } from '@ngrx/store';
import { SessionService } from 'sharedServices/session.service';
import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';
import { AppError } from 'sharedServices/Errors/app-error';
import { Exchange } from '@shared/models/exchange.model';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent {
  exchange$ = this.store.select(selectExchange)
  userId: string | undefined;
  currentPaginationFilters: Subject<object> = new Subject<object>();
  isMobile: boolean;
  warningMessage = '';
  user$ = this.authService.user$;

  @HostListener('window:resize', ['$event']) getScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService,
    private authService: AuthService
  ) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      this.userId = user?.sub?.split('auth0|')[1];

      this.getFirstPage({'fromUser.userId': this.userId });
    });
  }

  getFirstPage(filters: object) {
    this.service.getAll(1, filters)
    .subscribe(( response ) => {
      const exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  onFavoriteChanged(postId: string, eventArgs: FavoriteChangedEventArgs, ) {
    const eventValue = Object.values(eventArgs)[0];

    this.service.likePost(postId, eventValue, this.session.ID)
      .subscribe({
        next: () => {
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }));
        },
        error: (error: AppError) => { throw error; }
      })
  }
}
