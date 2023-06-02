import { ChangeDetectorRef, Component } from '@angular/core';
import { ErrorNotificationService } from 'sharedServices/error.notification';
import { NotificationsService } from 'sharedServices/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  errorNotification: string = '';
  showErrorNotification: boolean = false;

  constructor(
    private service: NotificationsService,
    private errorNotificationService: ErrorNotificationService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.service.connect();
    this.errorNotificationService
      .errorNotification$
      .subscribe(( message ) => {
        this.errorNotification = message;
        this.showErrorNotification = true;
        this.cdr.detectChanges();
      });
  }
}