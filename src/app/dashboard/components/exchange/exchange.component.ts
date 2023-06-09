import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';

import { ExchangeApiService } from '../../services/exchange.api.service';

import { AppError } from 'sharedServices/Errors/app-error';
import { NotFoundError } from 'sharedServices/Errors/not-found-error';

import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';

import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';


@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  animations: [
    fade
  ]
})

export class ExchangeComponent implements OnInit {
  exchange$ = this.store.select(selectExchange)

  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService
  ) { }

  ngOnInit() {}

  deletePost(postId: string) {
    this.service.remove(postId, this.session.ID)
    .subscribe({
      next: () => {
        this.store.dispatch(ExchangeApiActions.removePost({ postId }));
      },
      error: (error: AppError) => {
        if(error instanceof NotFoundError)
          alert('This post already been deleted')
        else throw error;
      }
    })
  }

  onFavoriteChanged(postId: string, eventArgs: FavoriteChangedEventArgs, ) {
    let eventValue = Object.values(eventArgs)[0];

    this.service.likePost(postId, eventValue, this.session.ID)
      .subscribe({
        next: () => {
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }));
        },
        error: (error: AppError) => { throw error; }
      })
  }
}
