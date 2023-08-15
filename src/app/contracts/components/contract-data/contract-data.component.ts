import { Component } from '@angular/core';
import { ContractsApiService } from '../../services/contracts.api.service';
import { ActivatedRoute } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contract } from '@shared/models/contract.model';
import { Store } from '@ngrx/store';
import { selectContractNotifications } from 'src/app/state/exchange.selectors';

@Component({
  selector: 'contract-data',
  templateUrl: './contract-data.component.html',
  styleUrls: ['./contract-data.component.scss']
})
export class ContractDataComponent {
  user$ = this.authService.user$;
  contractId!: string;
  contract!: any;
  contractNotifications$ = this.store.select(selectContractNotifications);
  confirmContractAlert = false;
  negotiateChargesAlert = false;
  form = new FormGroup({
    price: new FormControl<null | number>(null, [Validators.required]),
  })
  transportationDate = {
    pickup: undefined,
    delivery: undefined
  }

  constructor(
    private router: ActivatedRoute,
    private service: ContractsApiService,
    private authService: AuthService,
    private store: Store
  ) {
    this.router.params.subscribe(params => this.contractId = params['id']);
  }

  ngOnInit() {
    this.getContract();
    this.contractNotifications$.subscribe(contractNotif => {
      if(contractNotif?._id == this.contract?._id) {
        this.contract = contractNotif;
      }
    })
  }

  getContract() {
    this.service.getSingleContract(this.contractId)
      .subscribe({
        next: (contract: object) => {
          this.contract = contract;
          this.loadMap(contract);
        },
        error: (err) => { throw err; }
      })
  }


  negotiateContract(f: FormGroup) {
    const offer = {
      price: f.get('price')?.value,
      transportationDate: this.transportationDate
    }

    this.service.negotiateContract(this.contractId, offer)
      .subscribe({
        next: (contract: Contract) => {
          this.contract = contract;

          this.negotiateChargesAlert = false;
          this.form.reset();
          this.transportationDate.pickup = undefined;
          this.transportationDate.delivery = undefined;
        },
        error: (err) => { throw err }
      });
  }


  confirmContract(contractId: string) {
    this.service.confirmContract(contractId, this.transportationDate)
      .subscribe({
        next: (confirmedContract: object) => {
          this.contract = confirmedContract;
          this.confirmContractAlert = false;
          this.transportationDate.pickup = undefined;
          this.transportationDate.delivery = undefined;
        }
      })
  }

  loadMap(postData: any) {
    const loader = new Loader({
      apiKey: environment.google_maps_api_key,
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });

    return loader.load().then((google) => {
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

        constructor(map:any, postData: any) {
          this.map = map;
          this.postData = postData;

          this.originPlaceName = this.postData.freight_data.origin;
          this.destinationPlaceName = this.postData.freight_data.destination;
          this.originPlaceGeometry = { lat: postData.freight_data.geometry?.origin.lat, lng: postData.freight_data.geometry?.origin.lng };
          this.destinationPlaceGeometry = { lat: postData.freight_data.geometry?.destination.lat, lng: postData.freight_data.geometry?.destination.lng };
          this.distance = postData.freight_data.distance;

          this.travelMode = google.maps.TravelMode.DRIVING;
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(map);

          const originOutput= document.getElementById("originOutput") as HTMLElement;
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
