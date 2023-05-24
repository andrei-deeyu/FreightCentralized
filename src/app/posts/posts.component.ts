import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { AppError } from '../common/app-error';

import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';

import { FavoriteChangedEventArgs } from '../favorite/favorite.component';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: any;
  thePost: any;
  viewMode = '';

  constructor (private service: PostsService) {

  }

  ngOnInit() {
    this.service.getAll()
      .subscribe({
        next: (response) => this.posts = response
      });
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    this.posts.splice(0, 0, post);

    input.value = '';

    this.service.create(post)
    .subscribe(
      {
        next: (response:any) => {
          post.id = response.id;
        },
        error: (error: AppError) => {
          this.posts.splice(0, 1);

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
    let index = this.posts.indexOf(post);
    this.posts.splice(index, 1);

    this.service.delete(post.id)
    .subscribe({
      error: (error: AppError) => {
        this.posts.splice(index, 0, post);

        if(error instanceof NotFoundError)
          alert('This post already been deleted')
        else throw error;
      }
    })
  }


  onFavoriteChanged(eventArgs: FavoriteChangedEventArgs, index: number) {
    this.posts[index].isLiked = Object.values(eventArgs)[0]
  }
}