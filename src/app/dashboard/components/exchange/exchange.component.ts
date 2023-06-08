import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { selectCurrentPage, selectExchange } from 'src/app/state/exchange.selectors';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiActions, pageActiveActions } from 'src/app/state/exchange.actions';

import { ExchangeApiService } from '../../services/exchange.api.service';

import { AppError } from 'sharedServices/Errors/app-error';
import { BadInput } from 'sharedServices/Errors/bad-input';
import { NotFoundError } from 'sharedServices/Errors/not-found-error';

import { FavoriteChangedEventArgs } from '@shared/components/favorite/favorite.component';
import { CurrentPage } from '@shared/models/currentPage.model';

import { expandedCollapsed, fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';

interface inputBlurInterface {
  input: {
    [index: string]:Boolean
  }
}

@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  animations: [
    expandedCollapsed,
    fade
  ]
})

export class ExchangeComponent implements OnInit {
  exchange$ = this.store.select(selectExchange)
  currentPage$ = this.store.select(selectCurrentPage);
  selectedPagination = 0;
  viewMode = '';
  pagesToShow:number = 0;
  isExpanded: boolean = false;
  inputBlur: inputBlurInterface = { input: {} }

  form = new FormGroup({
    title: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
    body: new FormControl('', [ Validators.required ]),
  });

  get title() { return this.form.get('title') }
  get body() { return this.form.get('body') }


  constructor (
    private service: ExchangeApiService,
    private store: Store,
    private session: SessionService,
  ) { }

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
      this.selectedPagination = response.pageActive;
      this.store.dispatch(pageActiveActions.changePage({ currentPage }))

      let exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  onBlur(_formControlName: string) {
    this.inputBlur.input[_formControlName] = true
  }

  onFocus(_formControlName: string) {
    if(_formControlName === 'title')
      this.inputBlur.input = {}

    Object.keys(this.inputBlur.input)
      .filter(key => key !== 'title' ?  this.inputBlur.input[key] = false : null)
  }

  async createPost(f: FormGroup) {
    let insertPost: any = {
      title: f.value.title,
      body: f.value.body ?? ''
    };

    f.reset();
    this.inputBlur.input = {}

    this.service.create(insertPost, this.session.ID)
    .subscribe({
      next: (post: Exchange) => {
        this.currentPage$.subscribe(_curentPage => {
          if(_curentPage.pageActive !== 1) this.changePage(1);
          post.new = true;
          this.store.dispatch(ExchangeApiActions.addPost({ post }));
        }).unsubscribe()
      },
      error: (error: AppError) => {
        if(error instanceof BadInput)  {
          this.form.setErrors(error.originalError.error.message)
        } else throw error;
      }
    })
  }

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

  animationStarted($event:any) {
    console.log($event)
  }

  animationDone($event:any) {
    console.log($event)
  }
}
