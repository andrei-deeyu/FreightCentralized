import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from './Errors/app-error';
import { NotFoundError } from './Errors/not-found-error';
import { BadInput } from './Errors/bad-input';
import { NoInternetConnection } from './Errors/no-internet-connection';
import { Exchange } from '@shared/models/exchange.model';

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

  changeSubscription(type: string): Observable<{[index: string]:Object}> {
    return this.http
    .post<{[index: string]:Object}>(this.url + '/subscription', { type: type })
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
    const headers = new HttpHeaders().set("choosePage", JSON.stringify(choosePage))

    return this.http
      .get<GetPagination>(this.url + '/exchange', {  headers })
      .pipe(
        map((res) => {
          return res || [];
        }),
        catchError(this.handleError)
      );
  }

  search(term: string): Observable<Array<Exchange>> {
    if (term === '') return of([]);

    return this.http
    .get<Array<Exchange>>(this.url + '/exchange/search/' + term)
    .pipe(
      catchError(this.handleError)
    )
  }

  getAllPublic(): Observable<Array<Exchange>> {
    return this.http
      .get<Array<Exchange>>(this.url + '/exchange')
      .pipe(
        map((res) => {
          return res || [];
        }),
        catchError(this.handleError)
      );
  }

  create(post: Object, sessionID: string): Observable<Exchange> {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http
      .post<Exchange>(this.url + '/exchange', post, { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  remove(postId: string, sessionID: string) {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http.delete(this.url + '/exchange/post/' + postId, { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  likePost(postId: string, eventArgs: boolean, sessionID: string):Observable<Object> {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http.patch(this.url + '/exchange/post/' + postId,{ isLiked: eventArgs }, { headers })
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