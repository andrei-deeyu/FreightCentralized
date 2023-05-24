import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {
  post: any;

  constructor ( private route: ActivatedRoute, private service: PostService ) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        let idstr:string = params.get('id') || '0';
        let id:number = parseInt(idstr);

        this.service.getSingle(id)
          .subscribe({
            next: (response) => this.post = response
          })
      })
  }

  ceva() {
    this.service.getSomething()
    .subscribe({
      next: (response) => console.log(response)
    })
  }

}
