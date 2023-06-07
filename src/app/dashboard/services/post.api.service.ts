import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from "../../shared/services/data.service";
import { environment } from 'src/environments/environment';

@Injectable()
export class PostApiService extends DataService {
  constructor(http: HttpClient) {
    super(environment.API_URL, http);
  }
}