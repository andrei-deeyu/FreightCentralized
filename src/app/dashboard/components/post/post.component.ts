import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostApiService } from '../../services/post.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectSinglePost } from 'src/app/state/exchange.selectors';
import { ExchangeApiActions, SinglePostApiActions } from 'src/app/state/exchange.actions';
import { Exchange } from '@shared/models/exchange.model';
import { AuthService } from '@auth0/auth0-angular';
import { PostPublicApiService } from '../../services/post.public-api.service';
import { environment } from 'src/environments/environment';
import { SessionService } from 'sharedServices/session.service';
import { AppError } from 'sharedServices/Errors/app-error';
import { NotFoundError } from 'sharedServices/Errors/not-found-error';
import { postDeleted } from 'sharedServices/animations';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [ postDeleted ]
})

export class PostComponent implements OnInit {
  singlePost$ = this.store.select(selectSinglePost);
  singlePostLoaded: boolean = false;
  singlePostError: boolean = false;
  popUpAlert: boolean = false;
  deleteAlert: boolean = false;
  postDeleted: boolean = false;
  userId: string | undefined = '';
  isAuthor$ = new Subject<boolean>();

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private session: SessionService,
    private store: Store,
    private service: PostApiService,
    private public_service: PostPublicApiService ) { }


  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userId = user?.sub?.split('auth0|')[1];

      if( user ) {
        this.getSinglePost(this.service);
        this.singlePost$.subscribe((post) => {
          if(post.fromUser.userId) {
            if(post.fromUser.userId == this.userId) this.isAuthor$.next(true);
            else this.isAuthor$.next(false);
          }
        })
      } else {
        this.getSinglePost(this.public_service);
      }
    })
  }

  getSinglePost(theService: PostApiService | PostPublicApiService) {
    this.store.dispatch(SinglePostApiActions.initSinglePost());
    this.route.paramMap
      .subscribe(params => {
        let id:string = params.get('id') ?? '';

        theService.getSingle(id)
          .subscribe({
            next: ( singlePost: Exchange ) => {
              this.store.dispatch(SinglePostApiActions.retrievedSinglePost({ singlePost }))
              this.singlePostLoaded = true;
            },
            error: () => this.singlePostError = true
          });
        })
  }

  deletePost(postId: string) {
    this.service.remove(postId, this.session.ID)
    .subscribe({
      next: () => {
        this.deleteAlert = false;
        this.postDeleted = true;

        this.store.dispatch(ExchangeApiActions.removePost({ postId }));
        setTimeout(() => {
          this.router.navigate(['/exchange']);
        }, 2000);
      },
      error: (error: AppError) => {
        if(error instanceof NotFoundError)
          alert('This post already been deleted')
        else throw error;
      }
    })
  }

  share(where: string) {
    this.singlePost$.subscribe(post => {
      let postLink = `${environment.domainLink}exchange/${post._id}`;
      console.log(postLink)
      if(where == 'whatsapp') {
        window.location.href =
          'https://api.whatsapp.com/send?text=' + postLink;
      }
    })
  }
}
