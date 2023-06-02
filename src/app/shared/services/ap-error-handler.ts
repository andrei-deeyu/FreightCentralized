import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorNotificationService } from "./error.notification";
import { NotFoundError } from "./Errors/not-found-error";
import { NoInternetConnection } from "./Errors/no-internet-connection";

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