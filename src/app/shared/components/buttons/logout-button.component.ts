import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'logout-button',
  template: `
    <a [class]="stylingClasses" (click)="handleLogout()" (keyup.enter)="handleLogout()" tabindex="0">Log Out</a>
  `,
})
export class LogoutButtonComponent {
  @Input() stylingClasses = '';

  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

  handleLogout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}