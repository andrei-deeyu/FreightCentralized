import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  @Input('isLiked') isSelected: boolean = false;
  @Output('change') change = new EventEmitter();

  constructor() {

  }

  ngOnInit() {

  }

  onClick() {
    this.isSelected = !this.isSelected;
    this.change.emit({ liked: this.isSelected })
  }
}

export interface FavoriteChangedEventArgs {
  newValue: boolean
}