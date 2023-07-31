import { Component, EventEmitter, Output } from '@angular/core';


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
    distance: [0, 1100],
    tonnage: [0, 41],
    truckType: []
  };

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
    console.log(this.filters.truckType)
  }
}
