import { Component, EventEmitter, Output } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'exchange-filters',
  templateUrl: './exchange-filters.component.html',
  styleUrls: ['./exchange-filters.component.scss']
})
export class ExchangeFiltersComponent {
  @Output('paginationFilters') paginationFilters = new EventEmitter<Object>();

  truckTypes = [
    'duba', 'decopertat', 'basculanta', 'transport auto',
    'prelata', 'agabaritic', 'container'
  ];
  filters:any = {
    origin: '',
    destination: '',
    distance: [0, 1100],
    tonnage: [0, 41],
    truckType: []
  };

  location = '';
  destination = '';
  destinationPlaceholder = 'Unload city';

  ngOnInit() {
    // Load Google Maps Autocomplete
    this.loadAutoComplete().then(mapResults => {
      mapResults.subscribe((results: any) => {
        this.filters.origin = results.origin;
        this.filters.destination = results.destination;
        this.destinationPlaceholder = 'anywhere'
      })
    });
  }

  ngAfterViewInit() {
    this.paginationFilters.next({});
  }

  resetFilters() {
    this.filters = {
      distance: [0, 1100],
      tonnage: [0, 41],
      truckType: []
    }
    let checkboxes = document.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox: HTMLInputElement) => checkbox.checked = false);

    this.paginationFilters.next({});
  }

  submitPaginationFilters() {
    console.log(this.filters)
    this.paginationFilters.next({
      origin: this.filters.origin,
      destination: this.filters.destination,
      distance: [this.filters.distance[0], this.filters.distance[1] > 1000 ? null : this.filters.distance[1]],
      'size.tonnage': [this.filters.tonnage[0], this.filters.tonnage[1] > 40 ? null : this.filters.tonnage[1] ],
      'truck.type': this.filters.truckType
    })
  }

  onCheckChange( event: any) {
    if(event.target.checked == true)
      this.filters.truckType.push(event.target.value)
    else
      this.filters.truckType = this.filters.truckType.filter((e: any) => e !== event.target.value)
  }


  loadAutoComplete() {
    let subj: Subject<Object> = new Subject<Object>;
    const loader = new Loader({
      apiKey: environment.google_maps_api_key,
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });

    return loader.load().then((google) => {
      class AutocompletePlacesHandler {
        originPlaceName;
        destinationPlaceName;

        constructor() {
          this.originPlaceName = "";
          this.destinationPlaceName = "";

          const originInput= document.getElementById("origin-input") as HTMLInputElement;
          const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
          const originAutocomplete = new google.maps.places.Autocomplete(originInput);
          const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

          // Specify just the place data fields that you need.
          originAutocomplete.setFields(["name"]);
          destinationAutocomplete.setFields(["name"]);

          this.setupPlaceChangedListener(originAutocomplete, "ORIG");
          this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        }

        setupPlaceChangedListener(autocomplete:any, mode:any) {
           /* Just cities, prevent a long string of location */
          autocomplete.setTypes(["(cities)"]);

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.name) {
              window.alert("Select an option from the dropdown list");
              return;
            }

            if (mode === "ORIG") {
              this.originPlaceName = place.name;
            } else {
              this.destinationPlaceName = place.name
            }

            subj.next({
              origin: this.originPlaceName,
              destination: this.destinationPlaceName
            })
          });
        }
      }

      new AutocompletePlacesHandler();
      return subj;
    })
  }
}
