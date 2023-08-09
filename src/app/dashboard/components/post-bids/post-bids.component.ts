import { Component, Input } from '@angular/core';
import { PostBidsService } from '../../services/post-bids.api.service';
import { ActivatedRoute } from '@angular/router';
import { Bid } from '@shared/models/bid.model';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { NotFoundError, Observable, Subject, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fade } from 'sharedServices/animations';
import { SessionService } from 'sharedServices/session.service';
import { Store } from '@ngrx/store';
import { selectBid } from 'src/app/state/exchange.selectors';
import { AppError } from 'sharedServices/Errors/app-error';
import { Exchange } from '@shared/models/exchange.model';
import { Loader } from '@googlemaps/js-api-loader';


@Component({
  selector: 'post-bids',
  templateUrl: './post-bids.component.html',
  styleUrls: ['./post-bids.component.scss'],
  animations: [fade]
})
export class PostBidsComponent {
  @Input('isAuthor') isAuthor$ = new Observable<boolean>();
  @Input('postData') postData!: Exchange | null;
  isAuthorSubscription$!: Subscription
  postId!: string;

  bids$ = new Subject<Array<Bid>>();
  bidsObs$ = this.bids$.asObservable();
  newBid$!:Subscription;

  lowestBid!: Bid;
  whoseLowestBid!: string;
  reqUserBidPosition!: number;

  haveBiddingPermission!: boolean;
  form = new FormGroup({
    price: new FormControl<null | number>(null, [Validators.required])
  })
  modifyingOffer: boolean = false;
  liveEuroKm!: number;
  liveEuroKmTimer!: ReturnType<typeof setTimeout>;

  deleteAlert: boolean = false;
  acceptingTheBid: Bid | undefined;
  mapLoaded: boolean = false;

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
    this.isAuthorSubscription$ = this.isAuthor$.subscribe(_isAuthor => {
      this.getBids(_isAuthor);

      if (_isAuthor) {
        this.loadMap();

        let updateBids: Array<Bid> = [];
        this.bidsObs$.subscribe(currentBids => { updateBids = currentBids })

         this.newBid$ = this.store.select(selectBid).subscribe(newBid => {
          let deleteAction = newBid.fromUser['userId'] ? false : true;

          if (deleteAction) {
            let deleteBidIndex = updateBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
            updateBids.splice(deleteBidIndex, 1);
          } else {
            let doesntExist: boolean;
            if(updateBids) { // check if bids already exists
              doesntExist = updateBids?.findIndex(i => i.fromUser['userId'] == newBid.fromUser['userId']) == -1 ? true : false
            } else {
              doesntExist = true;
            }
            if (doesntExist) updateBids.push(newBid);
            else { // bid exists, then modify it
              let modifyingBidIndex = updateBids.map(i => i.fromUser['userId']).indexOf(newBid.fromUser['userId'])
              updateBids[modifyingBidIndex] = newBid;
            }
          }
        });

        this.bids$.next(updateBids);
      }
    });
  }

  ngOnDestroy() {
    if(this.isAuthorSubscription$) this.isAuthorSubscription$.unsubscribe();
    if(this.newBid$) this.newBid$.unsubscribe();
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

  setLiveEuroKm() {
    let formControlPrice = this.form.get('price')?.value;
    let toolpit = document.querySelector('#bid-tooltip') as HTMLElement;
    if(!(formControlPrice && this.postData && toolpit)) return;

    this.liveEuroKm = Number((formControlPrice / this.postData.distance).toFixed(2));
    clearTimeout(this.liveEuroKmTimer);
    toolpit.style.display = 'block';
    toolpit.style.marginLeft = `${formControlPrice.toString().length*8}px`
    this.liveEuroKmTimer = setTimeout(() => toolpit.style.display = 'none', 2000);
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
          else this.whoseLowestBid = '';
          this.reqUserBidPosition = bids[1].reqUserBidPosition;
          bids.splice(1, 1);
          this.bids$.next(bids);

          this.modifyingOffer = false;
          this.form.setValue({ price: null })
          this.form.markAsPristine();
          this.form.markAsUntouched()
        },
        error: (err) => { throw err }
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

  acceptBid(bid: Bid) {
    console.log(bid);
    this.acceptingTheBid = bid;
  }


  loadMap() {
    const loader = new Loader({
      apiKey: environment.google_maps_api_key,
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });

    return loader.load().then((google) => {
      this.mapLoaded = true;
      console.log(document.getElementById("map") as HTMLElement);
      class AutocompleteDirectionsHandler {
        map;
        postData;
        // acceptingTheBid_price

        travelMode;
        directionsService;
        directionsRenderer;

        originPlaceName;
        destinationPlaceName;
        originPlaceGeometry;
        destinationPlaceGeometry;
        distance;

        constructor(map:any, postData: Exchange /*, acceptingTheBid_price?: number*/) {
          this.map = map;
          this.postData = postData;
          // this.acceptingTheBid_price = acceptingTheBid_price ?? 0;

          this.originPlaceName = this.postData.origin;
          this.destinationPlaceName = this.postData.destination;
          this.originPlaceGeometry = { lat: postData.geometry?.origin.lat, lng: postData.geometry?.origin.lng };
          this.destinationPlaceGeometry = { lat: postData.geometry?.destination.lat, lng: postData.geometry?.destination.lng };
          this.distance = postData.distance;

          this.travelMode = google.maps.TravelMode.DRIVING;
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(map);

          const originOutput= document.getElementById("originOutput") as HTMLElement;
          const destinationOutput = document.getElementById("destinationOutput") as HTMLElement;

          const distancePriceOutput = document.getElementById("distance-priceOutput") as HTMLElement;
          const distanceOutput = document.getElementById("distance") as HTMLElement;
          // const pricePerKmOutput = document.getElementById("pricePerKm") as HTMLElement;

          originOutput.innerHTML = this.originPlaceName;
          destinationOutput.innerHTML = this.destinationPlaceName;
          distanceOutput.innerHTML = `${this.distance} km`;
          // pricePerKmOutput.innerHTML = ` - (${(this.acceptingTheBid_price/this.distance).toFixed(2)}EUR/km)`;

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
          const me = this;
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

      if(this.postData)
        new AutocompleteDirectionsHandler(map, this.postData);//, this.acceptingTheBid?.price);
    });
  }
}
