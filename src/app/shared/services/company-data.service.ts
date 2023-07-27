import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from './Errors/app-error';
import { NotFoundError } from './Errors/not-found-error';
import { BadInput } from './Errors/bad-input';
import { NoInternetConnection } from './Errors/no-internet-connection';
import { Company } from '@shared/models/company.model';
import { User } from '@shared/models/user.model';

export class CompanyDataService {
  constructor( private url:string, private http: HttpClient) {}

  searchUsers(term: string): Observable<Array<User>> {
    if (term === '') return of([]);

    return this.http
    .get<Array<User>>(this.url + '/searchusers/' + term)
    .pipe(
      catchError(this.handleError)
    )
  }

  getAll(): Observable<Array<Company>> {
    return this.http
    .get<Array<Company>>(this.url + '/companies')
    .pipe(
      catchError(this.handleError)
    )
  }

  getSingle(): Observable<Company> {
    return this.http
    .get<Company>(this.url + '/company')
    .pipe(
      catchError(this.handleError)
    )
  }

  create(newCompany: Object): Observable<Company> {
    return this.http
      .post<Company>(this.url + '/company', newCompany)
      .pipe(
        catchError(this.handleError)
      )
  }

  addEmployee(new_employee: User, company_id: string): Observable<{ state: string }> {
    return this.http
      .post<{ state: string }>(this.url + '/company/addemployee', { new_employee, company_id })
      .pipe(
        catchError(this.handleError)
      )
  }


  private handleError(error: Response) {
    switch(true) {
      case error.status === 0:
        return throwError(() => new NoInternetConnection(error))
      case error.status === 422:
        return throwError(() => new BadInput(error))
      case error.status === 404:
        return throwError(() => new NotFoundError())
      default:
        return throwError(() => new AppError(error))
    }
  }
}