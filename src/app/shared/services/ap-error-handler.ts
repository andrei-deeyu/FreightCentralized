import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorNotificationService } from "./error.notification";
import { NotFoundError } from "./Errors/not-found-error";
import { NoInternetConnection } from "./Errors/no-internet-connection";
import { BadInput } from "./Errors/bad-input";
import { BadInputDuplicate } from "./Errors/bad-input-duplicate";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError( error: Error ) {
    const notificationService = this.injector.get(ErrorNotificationService);
    console.log(error)

    switch(true) {
      case error instanceof NoInternetConnection:
        return notificationService.notify('No Internet Connection')
      case error instanceof NotFoundError:
        return notificationService.notify('Not found')
      case error instanceof BadInput:
        return notificationService.notify(error.message ?? 'Bad Input');
      case error instanceof BadInputDuplicate:
        return notificationService.notify('Already exists');
      default:
        return notificationService.notify('Something happened! Try again.')
    }
  }
}