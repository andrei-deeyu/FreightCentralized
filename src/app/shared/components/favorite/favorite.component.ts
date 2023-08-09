import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent {
  @Input('isLiked') isSelected: boolean | undefined = false;
  @Output() change = new EventEmitter();

  onClick() {
    this.isSelected = !this.isSelected;
    this.change.emit({ liked: this.isSelected })
  }
}

export interface FavoriteChangedEventArgs {
  newValue: boolean
}
