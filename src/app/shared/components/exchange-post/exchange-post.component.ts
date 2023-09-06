import { Component, HostListener, Input } from '@angular/core';
import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiService } from '../../../dashboard/services/exchange.api.service';
import { SessionService } from 'sharedServices/session.service';
import { Store } from '@ngrx/store';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';
import { AppError } from 'sharedServices/Errors/app-error';

@Component({
  selector: 'exchange-post',
  templateUrl: './exchange-post.component.html',
  styleUrls: ['./exchange-post.component.scss']
})
export class ExchangePostComponent {
  @Input('post') post!: Exchange;
  @Input('isEven') isEven!: boolean;
  isMobile: boolean;

  @HostListener('window:resize', ['$event']) getScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }


  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService,
  ) {
    this.isMobile = window.innerWidth <= 768;
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
