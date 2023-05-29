import { Component, OnInit } from '@angular/core';
import { ExchangePostService } from '../../services/exchange-post.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectSinglePost } from 'src/app/state/exchange.selectors';
import { SinglePostApiActions } from 'src/app/state/exchange.actions';
import { Exchange } from '../../models/exchange.model';

@Component({
  selector: 'exchange-post',
  templateUrl: './exchange-post.component.html',
  styleUrls: ['./exchange-post.component.scss']
})

export class ExchangePostComponent implements OnInit {
  singlePost$ = this.store.select(selectSinglePost)

  constructor (
    private route: ActivatedRoute,
    private service: ExchangePostService,
    private store: Store ) { }


  ngOnInit() {
    this.store.dispatch(SinglePostApiActions.initSinglePost());
    this.route.paramMap
      .subscribe(params => {
        let id:string = params.get('id') || '';

        this.service.getSingle(id)
          .subscribe((singlePost: Exchange) =>
            this.store.dispatch(SinglePostApiActions.retrievedSinglePost({ singlePost }))
          );
      })
  }
}
