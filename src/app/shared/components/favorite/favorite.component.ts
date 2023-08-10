import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent {
  @Input() isLiked: boolean | undefined = false;
  @Output() changeValue = new EventEmitter();

  onClick() {
    this.isLiked = !this.isLiked;
    this.changeValue.emit({ liked: this.isLiked })
  }
}

export interface FavoriteChangedEventArgs {
  newValue: boolean
}
