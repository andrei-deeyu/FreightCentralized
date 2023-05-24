import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';


export class DataService {
  constructor( private url:string, private http: HttpClient) {

  }

  getSomething() {
    return this.http.get(this.url + 3)
    .pipe(
      catchError(this.handleError)
    )
  }

  getSingle(id: number) {
    return this.http.get(this.url + id)
    .pipe(
      catchError(this.handleError)
    )
  }

  getAll() {
    return this.http.get(this.url)
    .pipe(
      catchError(this.handleError)
    )
  }

  create(resource: any) {
    return this.http.post(this.url, JSON.stringify(resource))
    .pipe(
      catchError(this.handleError)
    )
  }

  update(resource: any) {
    return this.http.patch(this.url + '/' + resource.id, { isRead: true })
    .pipe(
      catchError(this.handleError)
    )
  }

  delete(id: number) {
    console.log(id);

    return this.http.delete(this.url + '/' + id)
    .pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: Response) {
    if(error.status === 400)
      return throwError(() => new BadInput(error.json()))

    if(error.status === 404)
      return throwError(() => new NotFoundError())

    return throwError(() => new AppError(error))
  }
}
