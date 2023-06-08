import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
  viewMode = 'details';
  pagesToShow:number = 0;
  isExpanded: boolean = false;
  inputBlur: inputBlurInterface = { input: {} }
  numberRegEx = '^[0-9]{1,9}([,.][0-9]{1,9})?$';
  truckTypes = [
    'duba', 'decopertat', 'basculanta', 'transport auto',
    'prelata', 'agabaritic', 'container'
  ];
  truckFeatures = ['walkingfloor', 'ADR', 'FRIGO', 'izoterm', 'lift', 'MEGAtrailer'];
  truckSize = {
    tonnage: 'tons',
    volume: 'm3',
    height: 'm',
    width: 'm',
    length: 'm',
  };

  form = new FormGroup({
    details: new FormControl('', [ Validators.required ]),
    budget: new FormControl('', Validators.pattern(this.numberRegEx)),
    valability: new FormControl(''),
    pallet: new FormGroup({
      type: new FormControl(''),
      number: new FormControl('', Validators.pattern(this.numberRegEx)),
    }),
    size: new FormGroup({
      tonnage: new FormControl('', Validators.pattern(this.numberRegEx)),
      volume: new FormControl('', Validators.pattern(this.numberRegEx)),
      height: new FormControl('', Validators.pattern(this.numberRegEx)),
      width: new FormControl('', Validators.pattern(this.numberRegEx)),
      length: new FormControl('', Validators.pattern(this.numberRegEx)),
    }),
    truck: new FormGroup({
      regime: new FormControl(''),
      type: new FormArray([]),
      features: new FormArray([]),
    })
  });

  get details() { return this.form.get('details') }


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
    if(_formControlName === 'details')
      this.inputBlur.input = {}

    Object.keys(this.inputBlur.input)
      .filter(key => key !== 'details' ?  this.inputBlur.input[key] = false : null)
  }


  onCheckChange(formArrayName: string, event: any) {
    const formArray: FormArray = this.form.get('truck')?.get(formArrayName) as FormArray;

    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;

      formArray.controls.forEach((ctrl: AbstractControl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }


  async createPost(f: FormGroup) {
    console.log(f.value)
    let insertPost: any = {
      //location: 'this.location',
      //destination: 'this.destination',
      //distance: 'this.distance',
      details: f.value.details ?? '',
      budget: f.value.budget,
      valability: f.value.valability,
      pallet: {
        type: f.value.pallet.type,
        number: f.value.pallet.number,
      },
      size: {
        tonnage: f.value.size.tonnage,
        volume: f.value.size.volume,
        height: f.value.size.height,
        width: f.value.size.width,
        length: f.value.size.length,
      },
      truck: {
        regime: f.value.truck.regime,
        type: f.value.truck.type,
        features: f.value.truck.features,
      }
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
