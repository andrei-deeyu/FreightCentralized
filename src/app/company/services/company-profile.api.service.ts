import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyDataService} from 'sharedServices/company-data.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class CompanyProfileApiService extends CompanyDataService {
  constructor(http: HttpClient) {
    super(environment.API_URL, http)
  }
}