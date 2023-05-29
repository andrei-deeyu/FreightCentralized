import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';


@Injectable()
export class ExchangeService extends DataService {
  constructor(http: HttpClient) {
    super('http://localhost:5000/api/v1', http)
  }
}