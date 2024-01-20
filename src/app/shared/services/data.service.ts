import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from './Errors/app-error';
import { NotFoundError } from './Errors/not-found-error';
import { BadInput } from './Errors/bad-input';
import { NoInternetConnection } from './Errors/no-internet-connection';
import { Exchange } from '@shared/models/exchange.model';
import { Bid } from '@shared/models/bid.model';
import { Contract } from '@shared/models/contract.model';
import { DeviceInfo } from '@shared/types/device-info.interface';

export interface GetPagination {
  pagesToShow: number;
  pageActive: number;
  result: Exchange[]
}

export class DataService {
  constructor( private url:string, private http: HttpClient) {

  }

  signupLog(CTAText: string, deviceInfo: DeviceInfo) {
    return this.http
    .post(this.url + '/signupLog', { CTAText, ...deviceInfo }, { headers: { 'Content-Type': 'application/json' }})
    .pipe(
      catchError(this.handleError)
    )
  }

  resendVerification(): Observable<{ status: string }> {
    return this.http
    .get<{ status: string }>(this.url + '/verification-email')
    .pipe(
      catchError(this.handleError)
    )
  }

  saveProfile(newName?: string, phoneNumber?: string): Observable<{ state: string }> {
    return this.http
    .post<{ state: string }>(this.url + '/saveProfile', { name: newName, phoneNumber })
    .pipe(
      catchError(this.handleError)
    )
  }

  changeSubscription(type: string): Observable<{ state: string }> {
    return this.http
    .post<{ state: string }>(this.url + '/subscription', { type: type })
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

  getNearby(geolocation: object, nearbyRange: number): Observable<Exchange[]> {
    const headers = new HttpHeaders()
      .set("geoLocation", JSON.stringify(geolocation))
      .set("nearbyRange", JSON.stringify(nearbyRange));
    return this.http
    .get<Exchange[]>(this.url + '/exchange/nearby', { headers })
    .pipe(
      catchError(this.handleError)
    )
  }

  getAll(choosePage: number, filters: object): Observable<GetPagination> {
    const headers = new HttpHeaders()
      .set("choosePage", JSON.stringify(choosePage))
      .set('filters', encodeURIComponent(JSON.stringify(filters)));

    return this.http
      .get<GetPagination>(this.url + '/exchange', { headers })
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

  create(post: object, sessionID: string): Observable<Exchange> {
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

  likePost(postId: string, eventArgs: boolean, sessionID: string):Observable<object> {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http.patch(this.url + '/exchange/post/' + postId,{ isLiked: eventArgs }, { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  getBids(postId: string): Observable<Array<Bid>> {
    return this.http
      .get<Array<Bid>>(this.url + '/exchange/' + postId + '/bids')
      .pipe(
        map((res) => {
          return res || [];
        }),
        catchError(this.handleError)
      );
  }

  putBid(postId: string, offer: object, sessionID: string, shipperUserId: string): Observable<Array<Bid>> {
    const headers = new HttpHeaders()
      .set("userSession", JSON.stringify(sessionID))
      .set("shipper_userId", JSON.stringify(shipperUserId))

    return this.http
      .put<Array<Bid>>(this.url + '/exchange/' + postId + '/bid', offer, { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  negotiateBid(postId: string, bidId: string, offer: object): Observable<Bid> {
    return this.http
      .patch<Bid>(this.url + '/exchange/' + postId + '/' + bidId + '/negotiate', offer, { })
      .pipe(
        catchError(this.handleError)
      )
  }

  removeBid(bidId: string, sessionID: string) {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http.delete(this.url + '/exchange/' + bidId + '/bid', { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  getContracts(): Observable<Array<object>> {
    return this.http
      .get<Array<object>>(this.url + '/contracts')
      .pipe(
        map((res) => {
          return res || [];
        }),
        catchError(this.handleError)
      );
  }

  getSingleContract(contractId: string): Observable<object> {
    return this.http
      .get<object>(this.url + '/contracts/' + contractId)
      .pipe(
        catchError(this.handleError)
      );
  }

  createContract(postId: string, bidId: string, sessionID: string): Observable<object> {
    const headers = new HttpHeaders().set("userSession", JSON.stringify(sessionID))
    return this.http
      .post<object>(this.url + '/exchange/' + postId + '/' + bidId, {}, { headers })
      .pipe(
        catchError(this.handleError)
      )
  }

  negotiateContract(contractId: string, offer: object): Observable<Contract> {
    return this.http
      .patch<Contract>(this.url + '/contracts/' + contractId + '/negotiate', offer, { })
      .pipe(
        catchError(this.handleError)
      )
  }

  confirmContract(contractId: string, transportationDate: object): Observable<object> {
    return this.http
      .patch<object>(this.url + '/contracts/' + contractId + '/confirm', transportationDate, {})
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