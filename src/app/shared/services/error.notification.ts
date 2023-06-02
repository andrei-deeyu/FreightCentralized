import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';


@Injectable()
export class ErrorNotificationService {
  private _errorNotification: BehaviorSubject<any> = new BehaviorSubject(null);
  readonly errorNotification$: Observable<string> =
        this._errorNotification.asObservable().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  notify(message: string) {
    this._errorNotification.next(message);
    setTimeout(() => this._errorNotification.next(null), 3000);
  }
}