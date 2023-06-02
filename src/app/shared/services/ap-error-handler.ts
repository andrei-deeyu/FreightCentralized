import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorNotificationService } from "./error.notification";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error) {
    const notificationService = this.injector.get(ErrorNotificationService);
    return notificationService.notify('Something happened! Try again.')//'No Internet Connection');
  }
}