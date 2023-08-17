import { Component, Input } from '@angular/core';
import { PostBidsService } from '../../services/post-bids.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bid } from '@shared/models/bid.model';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, NotFoundError, Observable, Subject, Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
import { Store } from '@ngrx/store';
import { selectBid, selectSinglePost } from 'src/app/state/exchange.selectors';
import { AppError } from 'sharedServices/Errors/app-error';
import { Exchange } from '@shared/models/exchange.model';
import { Loader } from '@googlemaps/js-api-loader';
import { PostPublicApiService } from '../../services/post.public-api.service';
import { PostBidsPublicService } from '../../services/post-bids.public-api.service';
import { BidInitialState } from 'src/app/state/exchange.reducer';


@Component({
  selector: 'post-bids',
  templateUrl: './post-bids.component.html',
  styleUrls: ['./post-bids.component.scss'],
  animations: [fade]
})
export class PostBidsComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  @Input() isAuthor$ = new Observable<boolean>();
  singlePost$ = this.store.select(selectSinglePost);
  singlePostSubscription$!: Subscription;

  isAuthorSubscription$!: Subscription
  postId!: string;

  bids$ = new Subject<Array<Bid>>();
  bidsBehaviourSubject$ = new BehaviorSubject<Array<Bid>>([BidInitialState]);
  bidsObs$ = this.bids$.asObservable();
  bidsObsSubscription$!: Subscription;
  newBid$!: Subscription;

  lowestBid!: Bid;
  whoseLowestBid!: string;
  reqUserBidPosition: number | undefined;

  haveBiddingPermission!: boolean;
  form = new FormGroup({
    price: new FormControl<null | number>(null, [Validators.required]),
    valability: new FormControl('7days', { nonNullable: true }),
  })
  forms_negotiateOffer: any = new FormArray<any>([]);
  modifyingOffer = false;
  negotiatingOffer: Array<boolean> = [];

  liveEuroKm!: number;
  liveEuroKmTimer!: ReturnType<typeof setTimeout>;

  deleteAlert = false;
  acceptingTheBid: Bid | undefined;
  mapLoaded = false;

  constructor(
    private service: PostBidsService,
    private publicService: PostPublicApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private session: SessionService,
    private store: Store
  ) {
    this.route.params.subscribe(params => this.postId = params['id']);
  }

  ngOnInit() {
    this.checkSubscription();
    this.authService.user$.subscribe(user => {
      if (!user) return this.getBids(this.publicService);

      this.isAuthorSubscription$ = this.isAuthor$.subscribe(_isAuthor => {
        this.getBids(this.service, _isAuthor);

        if (_isAuthor) {
          this.singlePostSubscription$ = this.singlePost$.subscribe(postData => {
            if (postData.geometry) {
              this.loadMap(postData);
            }
          })

          // Get current bids
          let currentBids: Array<Bid> = [];
          this.bidsObsSubscription$ = this.bidsObs$.subscribe(_currentBids => { currentBids = _currentBids })

          // Listen if a new bid appears in the store
          this.newBid$ = this.store.select(selectBid).subscribe(newBid => {
            const deleteAction = newBid.fromUser['userId'] ? false : true;

            if (deleteAction) {
              const deleteBidIndex = currentBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
              currentBids.splice(deleteBidIndex, 1);
              this.forms_negotiateOffer.removeAt(deleteBidIndex);
            } else {
              let doesntExist: boolean;
              if (currentBids) { // check if bids already exists
                doesntExist = currentBids?.findIndex(i => i.fromUser['userId'] == newBid.fromUser['userId']) == -1 ? true : false
              } else { doesntExist = true; }

              if (doesntExist) {
                currentBids.push(newBid);
                this.forms_negotiateOffer.push(new FormGroup({ price: new FormControl<null | number>(null, [Validators.required]) }));
              } else { // bid exists, => modify it
                const modifyingBidIndex = currentBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
                currentBids[modifyingBidIndex] = newBid;
              }
            }
          });

          this.bids$.next(currentBids); // updated current bids
          this.bidsBehaviourSubject$.next(currentBids); // updated current bids
        } else {
          // Get current bids
          let currentBids: Array<Bid> = [];
          this.bidsObsSubscription$ = this.bidsObs$.subscribe(_currentBids => { currentBids = _currentBids })

          // Listen if a new bid appears in the store
          this.newBid$ = this.store.select(selectBid).subscribe(newBid => {
            const deleteAction = newBid.fromUser['userId'] ? false : true;

            if (deleteAction) {
              // delete action || store initial state
            } else {
              let doesntExist: boolean;
              if (currentBids) { // check if bids currently exists
                doesntExist = currentBids?.findIndex(i => i.fromUser['userId'] == newBid.fromUser['userId']) == -1 ? true : false
              } else { doesntExist = true; }
              if (doesntExist) {
                this.lowestBid = newBid;

                if (this.lowestBid._id == currentBids[0]?._id) {
                  this.whoseLowestBid = 'yours';
                  // reqUserBidPosition received through newBid[1]
                } else {
                  this.whoseLowestBid = '';
                  this.reqUserBidPosition = undefined;
                }
              } else { // shipper contraoffer the bid's price || lowest bid update
                const modifyingBidIndex = currentBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
                currentBids[modifyingBidIndex] = newBid;
                if (newBid.price == currentBids[modifyingBidIndex].price) {
                  this.whoseLowestBid = 'yours'
                  this.reqUserBidPosition = 1;
                } else {
                  this.whoseLowestBid = ''
                  this.reqUserBidPosition = undefined;
                }
              }
            }
          });

          this.bids$.next(currentBids); // updated current bids
          this.bidsBehaviourSubject$.next(currentBids); // updated current bids
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.isAuthorSubscription$) this.isAuthorSubscription$.unsubscribe();
    if (this.singlePostSubscription$) this.singlePostSubscription$.unsubscribe()
    if (this.bidsObsSubscription$) this.bidsObsSubscription$.unsubscribe();
    if (this.newBid$) this.newBid$.unsubscribe();
  }

  checkSubscription() {
    this.authService.user$.subscribe(user => {
      const subscription = user?.[`${environment.idtoken_namespace}app_metadata`]?.subscription;
      if (subscription == 'carrier' || subscription == 'logistic') this.haveBiddingPermission = true;
      else this.haveBiddingPermission = false;
    })
  }

  getBids(theService: PostBidsService | PostBidsPublicService, _isAuthor?: boolean) {
    theService.getBids(this.postId)
      .subscribe({
        next: (bids: Array<any>) => {// | Array<{lowestBid: Bid, reqUserBidPosition: number }>) => {
          const userBid = bids[0];
          const lowestBid = bids[1]?.lowestBid;
          const reqUserBidPosition = bids[1]?.reqUserBidPosition

          if (userBid && bids[1] && lowestBid && reqUserBidPosition && !_isAuthor) {
            this.lowestBid = lowestBid;
            if (this.lowestBid._id == userBid._id) this.whoseLowestBid = 'yours';
            this.reqUserBidPosition = reqUserBidPosition;
            bids.splice(1, 1);
          }

          if (_isAuthor) {
            bids.forEach(() => {
              this.forms_negotiateOffer.push(new FormGroup({ price: new FormControl<null | number>(null, [Validators.required]) }));
            })
          }

          this.bids$.next(bids);
          this.bidsBehaviourSubject$.next(bids);
        },
        error: (err) => { throw err }
      })
  }

  setLiveEuroKm() {
    this.singlePostSubscription$ = this.singlePost$.subscribe(postData => {
      const formControlPrice = this.form.get('price')?.value;
      const toolpit = document.querySelector('#bid-tooltip') as HTMLElement;
      if (!(formControlPrice && postData && toolpit)) return;

      this.liveEuroKm = Number((formControlPrice / postData.distance).toFixed(2));
      clearTimeout(this.liveEuroKmTimer);
      toolpit.style.display = 'block';
      toolpit.style.marginLeft = `${formControlPrice.toString().length * 8}px`
      this.liveEuroKmTimer = setTimeout(() => toolpit.style.display = 'none', 2000);
    })
  }

  putBid(f: FormGroup) {
    const offer = {
      price: f.get('price')?.value,
      valability: f.value.valability,
    }

    this.singlePostSubscription$ = this.singlePost$.subscribe(_post => {
      const shipperUserId = _post.fromUser.userId

      this.service.putBid(this.postId, offer, this.session.ID, shipperUserId)
        .subscribe({
          next: (bids: Array<any>) => {
            this.lowestBid = bids[1].lowestBid

            if (this.lowestBid._id == bids[0]._id) this.whoseLowestBid = 'yours';
            else this.whoseLowestBid = '';
            this.reqUserBidPosition = bids[1].reqUserBidPosition;
            bids.splice(1, 1);
            this.bids$.next(bids);
            this.bidsBehaviourSubject$.next(bids);

            this.modifyingOffer = false;
            this.form.reset();
          },
          error: (err) => { throw err }
        });
    });
  }

  negotiateBid(f: FormGroup, bidId: string | undefined) {
    if (!bidId) return;

    const offer = {
      price: f.get('price')?.value,
    }

    this.service.negotiateBid(this.postId, bidId, offer)/*, this.session.ID) */
      .subscribe({
        next: (bid: Bid) => {
          let currentBids: Array<Bid> = [];
          this.bidsBehaviourSubject$.subscribe(_currentBids => currentBids = _currentBids);

          currentBids.map((value, index) => {
            if (value._id == bid._id) currentBids[index] = bid;
          })

          this.bids$.next(currentBids); // updated current bids
          this.bidsBehaviourSubject$.next(currentBids); // updated current bids

          this.negotiatingOffer = [];
          this.form.reset();
        },
        error: (err) => { throw err }
      });
  }

  deleteBid(id: string) {
    this.service.removeBid(id, this.session.ID)
      .subscribe({
        next: () => {
          this.deleteAlert = false;
          let currentBids: Array<Bid> = [];

          this.bidsObsSubscription$ = this.bidsObs$.subscribe(_currentBids => { currentBids = _currentBids })
          const deleteBidIndex = currentBids.map(i => i._id).indexOf(id)
          currentBids.splice(deleteBidIndex, 1);
          this.bids$.next(currentBids); // updated current bids
          this.bidsBehaviourSubject$.next(currentBids); // updated current bids
        },
        error: (error: AppError) => {
          if (error instanceof NotFoundError)
            alert('This bid already been deleted')
          else throw error;
        }
      })
  }

  acceptingBid(bid: Bid) {
    this.acceptingTheBid = bid;
  }

  createContract(bidId: string | undefined) {
    if (!bidId) return;

    this.service.createContract(this.postId, bidId, this.session.ID)
      .subscribe({
        next: (contract: any) => {
          this.router.navigate(['/contracts/' + contract._id])
        },
        error: (err) => { throw err }
      });
  }


  loadMap(postData: Exchange) {
    const loader = new Loader({
      apiKey: environment.google_maps_api_key,
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });

    return loader.load().then((google) => {
      this.mapLoaded = true;

      class AutocompleteDirectionsHandler {
        map;
        postData;

        travelMode;
        directionsService;
        directionsRenderer;

        originPlaceName;
        destinationPlaceName;
        originPlaceGeometry;
        destinationPlaceGeometry;
        distance;

        constructor(map: any, postData: Exchange) {
          this.map = map;
          this.postData = postData;

          this.originPlaceName = this.postData.origin;
          this.destinationPlaceName = this.postData.destination;
          this.originPlaceGeometry = { lat: postData.geometry?.origin.lat, lng: postData.geometry?.origin.lng };
          this.destinationPlaceGeometry = { lat: postData.geometry?.destination.lat, lng: postData.geometry?.destination.lng };
          this.distance = postData.distance;

          this.travelMode = google.maps.TravelMode.DRIVING;
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(map);

          const originOutput = document.getElementById("originOutput") as HTMLElement;
          const destinationOutput = document.getElementById("destinationOutput") as HTMLElement;

          const distancePriceOutput = document.getElementById("distance-priceOutput") as HTMLElement;
          const distanceOutput = document.getElementById("distance") as HTMLElement;

          originOutput.innerHTML = this.originPlaceName;
          destinationOutput.innerHTML = this.destinationPlaceName;
          distanceOutput.innerHTML = `${this.distance} km`;

          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originOutput);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(destinationOutput);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(distancePriceOutput);

          this.route();
        }


        route() {
          if (!this.originPlaceGeometry?.lat || !this.originPlaceGeometry.lng
            ||
            !this.destinationPlaceGeometry?.lat || !this.destinationPlaceGeometry.lng
          ) {
            return;
          }
          // route initiation on the map
          const me = this; // eslint-disable-line @typescript-eslint/no-this-alias
          return this.directionsService.route(
            {
              origin: { lat: this.originPlaceGeometry.lat, lng: this.originPlaceGeometry.lng },
              destination: { lat: this.destinationPlaceGeometry.lat, lng: this.destinationPlaceGeometry.lng },
              travelMode: this.travelMode,
            },
            (response, status) => {
              if (status === "OK") {
                me.directionsRenderer.setDirections(response);
              } else {
                return window.alert("Directions request failed due to " + status);
              }
            }
          );
        }
      }

      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        mapTypeControl: false,
        center: { lat: 46, lng: 25 },
        zoom: 6,
      });

      new AutocompleteDirectionsHandler(map, postData);
    });
  }
}
