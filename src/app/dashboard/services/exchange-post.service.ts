import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from "../../shared/services/data.service";

@Injectable()
export class ExchangePostService extends DataService {
  constructor(http: HttpClient) {
    let url:string = 'http://localhost:5000/api/v1'
    super(url, http);
  }
}