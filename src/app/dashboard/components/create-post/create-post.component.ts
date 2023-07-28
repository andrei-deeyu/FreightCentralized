import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { selectCurrentPage, selectExchange } from 'src/app/state/exchange.selectors';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiActions } from 'src/app/state/exchange.actions';

import { ExchangeApiService } from '../../services/exchange.api.service';

import { AppError } from 'sharedServices/Errors/app-error';
import { BadInput } from 'sharedServices/Errors/bad-input';

import { expandedCollapsed } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

interface inputBlurInterface {
  input: {
    [index: string]:Boolean
  }
}


@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  animations: [ expandedCollapsed ]
})
export class CreatePostComponent {
  haveAccess: boolean = false;
  exchange$ = this.store.select(selectExchange)
  currentPage$ = this.store.select(selectCurrentPage);
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
    private pagination: PaginationComponent,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.checkSubscription()
  }

  checkSubscription() {
    this.authService.user$.subscribe(user => {
      let subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      console.log(subscription);
      if(subscription == 'shipper' || subscription == 'forwarder') this.haveAccess = true;
    })
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

  clearCheckFormControls(formArrayName: string) {
    const formArray: FormArray = this.form.get('truck')?.get(formArrayName) as FormArray;
    formArray.controls.forEach((ctrl: AbstractControl, i) => {
      formArray.removeAt(i)
    });
  }

  async createPost(f: FormGroup) {
    console.log(f.value)
    let insertPost: any = {
      //location: 'this.location',
      //destination: 'this.destination',
      //distance: 'this.distance',
      details: f.value.details ?? '',
      budget: f.value.budget ?? null,
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


    this.service.create(insertPost, this.session.ID)
    .subscribe({
      next: (post: Exchange) => {
        f.reset();
        this.inputBlur.input = {}
        let checkboxes = document.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
        checkboxes.forEach((checkbox: HTMLInputElement) => checkbox.checked = false);
        this.clearCheckFormControls('type');
        this.clearCheckFormControls('features');

        this.currentPage$.subscribe(_curentPage => {
          if(_curentPage.pageActive !== 1) this.pagination.changePage(1)
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


  animationStarted($event:any) {
    console.log($event)
  }

  animationDone($event:any) {
    console.log($event)
  }
}
