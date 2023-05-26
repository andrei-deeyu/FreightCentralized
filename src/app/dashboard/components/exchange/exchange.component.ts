import { Component, OnInit } from '@angular/core';

import { AppError } from '../../../shared/services/app-error';
import { BadInput } from '../../../shared/services/bad-input';
import { NotFoundError } from '../../../shared/services/not-found-error';


import { FavoriteChangedEventArgs } from '../../../shared/components/favorite/favorite.component';

import { ExchangeService } from '../../services/exchange.service';


@Component({
  selector: 'exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {
  exchange: any;
  thePost: any;
  viewMode = '';

  constructor (private service: ExchangeService) {

  }

  ngOnInit() {
    this.service.getAll()
      .subscribe({
        next: (response) => this.exchange = response
      });
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    this.exchange.splice(0, 0, post);

    input.value = '';

    this.service.create(post)
    .subscribe(
      {
        next: (response:any) => {
          post.id = response.id;
        },
        error: (error: AppError) => {
          this.exchange.splice(0, 1);

          if(error instanceof BadInput)  {
             // this.form.setErrors(error.originalError)
          } else throw error;
        }
      })
  }

  updatePost(post: any) {
    this.service.update(post)
      .subscribe(response => {
        console.log(response)
      });
  }

  deletePost(post: any) {
    let index = this.exchange.indexOf(post);
    this.exchange.splice(index, 1);

    this.service.delete(post.id)
    .subscribe({
      error: (error: AppError) => {
        this.exchange.splice(index, 0, post);

        if(error instanceof NotFoundError)
          alert('This post already been deleted')
        else throw error;
      }
    })
  }


  onFavoriteChanged(eventArgs: FavoriteChangedEventArgs, index: number) {
    this.exchange[index].isLiked = Object.values(eventArgs)[0]
  }
}