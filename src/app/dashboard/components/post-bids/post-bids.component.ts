import { Component, Input } from '@angular/core';
import { PostBidsService } from '../../services/post-bids.api.service';
import { ActivatedRoute } from '@angular/router';
import { Bid } from '@shared/models/bid.model';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { NotFoundError, Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
import { Store } from '@ngrx/store';
import { selectBid } from 'src/app/state/exchange.selectors';
import { AppError } from 'sharedServices/Errors/app-error';


@Component({
  selector: 'post-bids',
  templateUrl: './post-bids.component.html',
  styleUrls: ['./post-bids.component.scss'],
  animations: [fade]
})
export class PostBidsComponent {
  @Input('isAuthor') isAuthor$ = new Observable<boolean>();
  @Input('postDistance') postDistance: number | undefined;

  postId!: string;
  bids$ = new Subject<Array<Bid>>();
  bidsObs$ = this.bids$.asObservable();
  lowestBid!: Bid;
  whoseLowestBid!: string;
  reqUserBidPosition!: number;

  haveBiddingPermission!: boolean;
  form = new FormGroup({
    price: new FormControl<null | number>(null, [Validators.required])
  })
  modifyingOffer: boolean = false;
  deleteAlert: boolean = false;

  constructor(
    private service: PostBidsService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private session: SessionService,
    private store: Store
  ) {
    this.router.params.subscribe(params => this.postId = params['id']);
  }

  ngOnInit() {
    this.checkSubscription();
    this.isAuthor$.subscribe(_isAuthor => {
      this.getBids(_isAuthor);
      if (_isAuthor) {
        let updateBids: Array<Bid> = [];

        this.bidsObs$.subscribe(currentBids => { updateBids = currentBids })
        this.store.select(selectBid).subscribe(newBid => {
          let deleteAction = newBid.fromUser['userId'] ? false : true;
          if (deleteAction) {
            let deleteBidIndex = updateBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
            updateBids.splice(deleteBidIndex, 1);
          } else {
            let doesntExist = updateBids.findIndex(i => i.fromUser['userId'] == newBid.fromUser['userId']) == -1 ? true : false
            if (doesntExist) updateBids.push(newBid);
            else {
              let modifyingBidIndex = updateBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
              updateBids[modifyingBidIndex] = newBid;
            }
          }
        })

        this.bids$.next(updateBids);
      }
    })
  }

  checkSubscription() {
    this.authService.user$.subscribe(user => {
      let subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      if (subscription == 'carrier' || subscription == 'logistic') this.haveBiddingPermission = true;
      else this.haveBiddingPermission = false;
    })
  }

  getBids(_isAuthor: boolean) {
    this.service.getBids(this.postId)
      .subscribe({
        next: (bids: Array<any>) => {// | Array<{lowestBid: Bid, reqUserBidPosition: number }>) => {

          if (bids[0] && bids[1] && bids[1].lowestBid && bids[1].reqUserBidPosition && !_isAuthor) {
            this.lowestBid = bids[1].lowestBid
            if (this.lowestBid._id == bids[0]._id) this.whoseLowestBid = 'yours';
            this.reqUserBidPosition = bids[1].reqUserBidPosition;
            bids.splice(1, 1);
          }

          this.bids$.next(bids);
        },
        error: (err) => console.log(err)
      })
  }


  putBid(f: FormGroup) {
    let offer = {
      price: f.get('price')?.value
    }
    this.service.putBid(this.postId, offer, this.session.ID)
      .subscribe({
        next: (bids: Array<any>) => {
          this.lowestBid = bids[1].lowestBid

          if (this.lowestBid._id == bids[0]._id) this.whoseLowestBid = 'yours';
          else this.whoseLowestBid = ''
          this.reqUserBidPosition = bids[1].reqUserBidPosition;
          bids.splice(1, 1);
          this.bids$.next(bids);
          this.modifyingOffer = false;
          this.form.setValue({ price: null })
          this.form.markAsPristine();
          this.form.markAsUntouched()
        },
        // error: () =>
      });
  }

  deleteBid(id: string) {
    this.service.removeBid(id, this.session.ID)
      .subscribe({
        next: () => {
          this.deleteAlert = false;
          let updateBids: Array<Bid> = [];

          this.bidsObs$.subscribe(currentBids => { updateBids = currentBids })
          let deleteBidIndex = updateBids.map(i => i._id).indexOf(id)
          updateBids.splice(deleteBidIndex, 1);
          this.bids$.next(updateBids);
        },
        error: (error: AppError) => {
          if (error instanceof NotFoundError)
            alert('This bid already been deleted')
          else throw error;
        }
      })
  }
}
