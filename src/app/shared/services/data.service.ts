import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from './Errors/app-error';
import { NotFoundError } from './Errors/not-found-error';
import { BadInput } from './Errors/bad-input';
import { NoInternetConnection } from './Errors/no-internet-connection';
import { Exchange } from 'src/app/dashboard/models/exchange.model';

export interface GetPagination {
  pagesToShow: number;
  pageActive: number;
  result: Exchange[]
}

export class DataService {
  constructor( private url:string, private http: HttpClient) {

  }

  resendVerification(): Observable<{[index: string]:Object}> {
    return this.http
    .get<{[index: string]:Object}>(this.url + '/verification-email')
    .pipe(
      catchError(this.handleError)
    )
  }

  saveProfile(newName: string): Observable<{[index: string]:Object}> {
    return this.http
    .post<{[index: string]:Object}>(this.url + '/saveProfile', { name: newName })
    .pipe(
      catchError(this.handleError)
    )
  }


  getSingle(id: string): Observable<Exchange> {
    return this.http
    .get<Exchange>(this.url + '/exchange/post/' + id)
    .pipe(
      catchError(this.handleError)
    )
  }


  getAll(choosePage: number): Observable<GetPagination> {
    const headers = new HttpHeaders().set("choosePage", JSON.stringify(choosePage),)

    return this.http
      .get<GetPagination>(this.url + '/exchange', {  headers })
      .pipe(
        map((res) => {
          return res || [];
        }),
        catchError(this.handleError)
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