import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { selectCurrentPage, selectExchange } from 'src/app/state/exchange.selectors';
import { Exchange } from '../../models/exchange.model';
import { ExchangeApiActions, pageActiveActions } from 'src/app/state/exchange.actions';

import { ExchangeService } from '../../services/exchange.service';

import { AppError } from 'sharedServices/app-error';
import { BadInput } from 'sharedServices/bad-input';
import { NotFoundError } from 'sharedServices/not-found-error';

import { FavoriteChangedEventArgs } from '../../../shared/components/favorite/favorite.component';
import { CurrentPage } from 'src/app/shared/models/currentPage.model';

@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {
  exchange$ = this.store.select(selectExchange)
  currentPage$ = this.store.select(selectCurrentPage);
  viewMode = '';
  pagesToShow:number = 0;

  form = new FormGroup({
    title: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
    body: new FormControl('', [ Validators.required ]),
  });
  get title() { return this.form.get('title') }
  get body() { return this.form.get('body') }


  constructor (private service: ExchangeService, private store: Store) { }

  ngOnInit() {
    this.service.getAll(1)
      .subscribe(( response ) => {
        this.pagesToShow = response.pagesToShow;

        let exchange:Exchange[] = response.result
        this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
      });
  }

  changePage(choosePage: number) {
    this.service.getAll(choosePage)
    .subscribe(( response ) => {
      this.pagesToShow = response.pagesToShow;

      let currentPage:CurrentPage = { pageActive: response.pageActive } ;
      this.store.dispatch(pageActiveActions.changePage({ currentPage }))

      let exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  createPost(f: FormGroup) {
    let insertPost: any = {
      userId: 1007,
      title: f.value.title,
      body: f.value.body
    };

    f.reset();

    this.service.create(insertPost)
    .subscribe({
      next: (post: Exchange) => {
        this.changePage(1);
        this.store.dispatch(ExchangeApiActions.addPost({ post }));
      },
      error: (error: AppError) => {
        if(error instanceof BadInput)  {
          this.form.setErrors(error.originalError.error.message)
        } else throw error;
      }
    })
  }

  deletePost(postId: string) {
    this.service.remove(postId)
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

    this.service.likePost(postId, eventValue)
      .subscribe({
        next: () => {
          this.store.dispatch(ExchangeApiActions.likePost({ postId, eventValue }));
        },
        error: (error: AppError) => { throw error; }
      })
  }
}
