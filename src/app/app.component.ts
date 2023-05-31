import { Component } from '@angular/core';
import { NotificationsService } from 'sharedServices/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private service: NotificationsService) { }

  ngOnInit() {
    this.service.connect();
  }
}
