import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from './app-error';
import { NotFoundError } from './not-found-error';
import { BadInput } from './bad-input';
import { Exchange } from 'src/app/dashboard/models/exchange.model';

export interface GetPagination {
  pagesToShow: number;
  pageActive: number;
  result: Exchange[]
}

export class DataService {
  constructor( private url:string, private http: HttpClient) {

  }

  getSingle(id: string): Observable<Exchange> {
    return this.http
    .get<Exchange>(this.url + '/exchange/post/' + id)
    .pipe(
      catchError(this.handleError)
    )
  }


  getAll(choosePage: number): Observable<GetPagination> {
    const headers = new HttpHeaders()
      .set("choosePage", JSON.stringify(choosePage))

    return this.http
      .get<GetPagination>(this.url + '/exchange', { headers })
      .pipe(
        map((res) => {
          return res || [];
        })
      );
  }

  create(post: Object): Observable<Exchange> {
    return this.http
      .post<Exchange>(this.url + '/exchange', post)
      .pipe(
        catchError(this.handleError)
      )
  }

  remove(postId: string) {
    return this.http.delete(this.url + '/exchange/post/' + postId)
      .pipe(
        catchError(this.handleError)
      )
  }

  likePost(postId: string, eventArgs: boolean):Observable<Object> {
    return this.http.patch(this.url + '/exchange/post/' + postId, { isLiked: eventArgs })
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