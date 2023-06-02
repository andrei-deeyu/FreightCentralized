import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { ErrorNotificationService } from "./error.notification";
import { NotFoundError } from "./not-found-error";
import { NoInternetConnection } from "./no-internet-connection";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError( error: Error ) {
    const notificationService = this.injector.get(ErrorNotificationService);

    switch(true) {
      case error instanceof NoInternetConnection:
        return notificationService.notify('No Internet Connection')
      case error instanceof NotFoundError:
        return notificationService.notify('Not found')
      default:
        return notificationService.notify('Something happened! Try again.')
    }
  }
}