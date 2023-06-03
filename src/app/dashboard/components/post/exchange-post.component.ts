import { Component, OnInit } from '@angular/core';
import { ExchangePostService } from '../../services/exchange-post.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectSinglePost } from 'src/app/state/exchange.selectors';
import { SinglePostApiActions } from 'src/app/state/exchange.actions';
import { Exchange } from '../../models/exchange.model';
import { AuthService } from '@auth0/auth0-angular';
import { ExchangePost_PublicService } from '../../services/exchange-post.public.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'exchange-post',
  templateUrl: './exchange-post.component.html',
  styleUrls: ['./exchange-post.component.scss']
})

export class ExchangePostComponent implements OnInit {
  singlePost$ = this.store.select(selectSinglePost);
  singlePostLoaded: boolean = false;
  singlePostError: boolean = false;

  constructor (
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store,
    private service: ExchangePostService,
    private public_service: ExchangePost_PublicService ) { }


  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if( user ) {
        this.getSinglePost(this.service);
      } else {
        this.getSinglePost(this.public_service);
      }
    })
  }

  getSinglePost(theService: ExchangePostService | ExchangePost_PublicService) {
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
            error: (err) => this.singlePostError = true
          });
        })
  }

  share(where: string) {
    this.singlePost$.subscribe(post => {
      let postLink = `${environment.domainName}exchange/${post._id}`;
      console.log(postLink)
      if(where == 'whatsapp') {
        window.location.href =
          'https://api.whatsapp.com/send?text=' + postLink;
      }
    })
  }
}
