import { Component, OnInit } from '@angular/core';
import { ExchangePostService } from '../../services/exchange-post.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'exchange-post',
  templateUrl: './exchange-post.component.html',
  styleUrls: ['./exchange-post.component.scss']
})

export class ExchangePostComponent implements OnInit {
  post: any;

  constructor ( private route: ActivatedRoute, private service: ExchangePostService ) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        let idstr:string = params.get('id') || '0';
        let id:number = parseInt(idstr);

        this.service.getSingle(id)
          .subscribe({
            next: (response) => this.post = response,
            error: (err) => console.log(err)
          })
      })
  }
}
