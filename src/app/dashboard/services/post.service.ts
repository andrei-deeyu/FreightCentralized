import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from "../../shared/services/data.service";

@Injectable()
export class PostService extends DataService {
  constructor(http: HttpClient) {
    let url:string = 'https://jsonplaceholder.typicode.com/posts/'
    super(url, http);
  }
}