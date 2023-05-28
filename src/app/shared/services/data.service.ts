import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from './app-error';
import { NotFoundError } from './not-found-error';
import { BadInput } from './bad-input';
import { Exchange } from 'src/app/dashboard/models/exchange.model';


export class DataService {
  constructor( private url:string, private http: HttpClient) {

  }

  getSingle(id: number) {
    return this.http.get(this.url + id)
    .pipe(
      catchError(this.handleError)
    )
  }


  getAll(): Observable<Array<Exchange>> {
    return this.http
      .get<Exchange[]>('https://jsonplaceholder.typicode.com/posts/')
      .pipe(
        map((res) => {
          return res || [];
        })
      );
  }

  create(post: Object): Observable<Object> {
    return this.http
      .post(this.url, JSON.stringify(post))
      .pipe(
        catchError(this.handleError)
      )
  }

  remove(postId: number) {
    return this.http.delete(this.url + '/' + postId)
      .pipe(
        catchError(this.handleError)
      )
  }

  likePost(postId: number, eventArgs: boolean):Observable<Object> {
    return this.http.patch(this.url + '/' + postId, { isLiked: eventArgs })
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


  private handleError(error: Response) {
    if(error.status === 400)
      return throwError(() => new BadInput(error.json()))

    if(error.status === 404)
      return throwError(() => new NotFoundError())

    return throwError(() => new AppError(error))
  }
}