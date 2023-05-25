import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs/internal/observable/of";
import { delay } from "rxjs/internal/operators/delay";

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  private theToken:string = '';


  private readonly _MOCK_RESPONSE = of(
    new HttpResponse({
      status: 200,
      statusText: 'OK'
    })
  ).pipe(delay(1000));

  private readonly _MOCK_RESPONSE_TOKEN = of(
    new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: { token: this.theToken }
    })
  ).pipe(delay(1000));

  private readonly _MOCK_RESPONSE_ORDERS = of(
    new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: [ 1, 2, 3 ]
    })
  ).pipe(delay(1000));


  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.method === 'POST' && request.url.endsWith('/api/authenticate')) {
      if( request.body.email === 'mosh@email.com' && request.body.password === '1234' )
        return this._MOCK_RESPONSE_TOKEN;

      return this._MOCK_RESPONSE;
    }

    if (request.method === 'GET' && request.url.endsWith('/api/orders')) {
      if( request.headers.get('Authorization') === 'Bearer ' + this.theToken)
        return this._MOCK_RESPONSE_ORDERS;

      return this._MOCK_RESPONSE;
    }
    return next.handle(request);
  }

}