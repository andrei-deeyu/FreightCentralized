import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { selectExchange } from 'src/app/state/exchange.selectors';
import { Exchange } from '../../models/exchange.model';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';

import { ExchangeService } from '../../services/exchange.service';

import { AppError } from 'sharedServices/app-error';
import { BadInput } from 'sharedServices/bad-input';
import { NotFoundError } from 'sharedServices/not-found-error';

import { FavoriteChangedEventArgs } from '../../../shared/components/favorite/favorite.component';

@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {
  exchange$ = this.store.select(selectExchange)
  viewMode = '';
  pagesToShow:number = 0;
  pageActive:number = 0;

  form = new FormGroup({
    title: new FormControl('', [ Validators.required ]),
    body: new FormControl('', [ Validators.required ]),
  });


  constructor (private service: ExchangeService, private store: Store) { }

  ngOnInit() {
    this.service.getAll(1)
      .subscribe((response) => {
        this.pagesToShow = response.pagesToShow;
        this.pageActive = response.pageActive;

        let exchange:Exchange[] = response.result
        this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
      });
  }

  changePage(choosePage: number) {
    this.service.getAll(choosePage)
    .subscribe((response) => {
      this.pagesToShow = response.pagesToShow;
      this.pageActive = response.pageActive;

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
        console.log(post);
        this.changePage(1);
        this.store.dispatch(ExchangeApiActions.addPost({ post }));
      },
      error: (error: AppError) => {
        if(error instanceof BadInput)  {
            // this.form.setErrors(error.originalError)
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
        error: (error: AppError) => {}
      })
  }
}
