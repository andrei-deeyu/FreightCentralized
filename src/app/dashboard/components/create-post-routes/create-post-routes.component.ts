import { Component, EventEmitter, Output } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { RouteData } from '@shared/models/routeData.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'create-post-routes',
  templateUrl: './create-post-routes.component.html',
  styleUrls: ['./create-post-routes.component.scss']
})
export class CreatePostRoutesComponent {
  @Output() routeData: EventEmitter<RouteData> = new EventEmitter<RouteData>;
  distance = 0;
  location = '';
  destination = '';

  ngOnInit() {
    // Load Google Maps
    this.loadMap().then(mapResults => {
      mapResults.subscribe((results: RouteData) => {
        console.log(results)
        this.distance = results.distance
        this.routeData.emit(results);
      })
    });
  }

  loadMap() {
    const subj: Subject<RouteData> = new Subject<RouteData>;
    const loader = new Loader({
      apiKey: environment.google_maps_api_key,
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });

    return loader.load().then((google) => {
      class AutocompleteDirectionsHandler {
        map;
        originPlaceId;
        destinationPlaceId;
        travelMode;
        directionsService;
        directionsRenderer;
        originPlaceName;
        destinationPlaceName;
        originPlaceGeometry;
        destinationPlaceGeometry;
        distance;

        constructor(map:any) {
          this.map = map;
          this.originPlaceId = "";
          this.destinationPlaceId = "";
          this.originPlaceName = "";
          this.destinationPlaceName = "";
          this.originPlaceGeometry = {lat: 0, lng: 0};
          this.destinationPlaceGeometry = {lat: 0, lng: 0};
          this.distance = 0;
          this.travelMode = google.maps.TravelMode.DRIVING;
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(map);


          const originInput= document.getElementById("origin-input") as HTMLInputElement;
          const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
          const modeSelector = document.getElementById("mode-selector");
          const distanceOutput = document.getElementById("distance");
          const originAutocomplete = new google.maps.places.Autocomplete(originInput);
          const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

          // Specify just the place data fields that you need.
          originAutocomplete.setFields(["place_id", "name", "geometry"]);
          destinationAutocomplete.setFields(["place_id", "name", "geometry"]);

          this.setupPlaceChangedListener(originAutocomplete, "ORIG");
          this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
            destinationInput
          );
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(distanceOutput);
        }

        setupPlaceChangedListener(autocomplete:any, mode:any) {
           /* Just cities, prevent a long string of location */
          autocomplete.setTypes(["(cities)"]);

          autocomplete.bindTo("bounds", this.map);
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
              window.alert("Select an option from the dropdown list");
              return;
            }

            if (mode === "ORIG") {
              this.originPlaceId = place.place_id;
              this.originPlaceName = place.name;
              this.originPlaceGeometry = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            } else {
              this.destinationPlaceName = place.name;
              this.destinationPlaceId = place.place_id;
              this.destinationPlaceGeometry = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            }
            console.log(this.originPlaceGeometry, this.destinationPlaceGeometry)
            this.route()?.then(result => {
              this.distance = result?.routes[0].legs[0].distance?.value ?? 0;
              subj.next({
                geometry: {
                  origin: this.originPlaceGeometry,
                  destination: this.destinationPlaceGeometry
                },
                origin: this.originPlaceName,
                destination: this.destinationPlaceName,
                distance: Math.round(this.distance > 0 ? this.distance / 1000 : 0)
              })
            })
          });
        }

        route() {
          if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
          }

          // route initiation on the map
          const me = this;
          return this.directionsService.route(
            {
              origin: { placeId: this.originPlaceId },
              destination: { placeId: this.destinationPlaceId },
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

      new AutocompleteDirectionsHandler(map);

      return subj;
    })
  }
}