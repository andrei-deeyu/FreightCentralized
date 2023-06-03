import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'logout-button',
  template: `
    <a [class]="stylingClasses" (click)="handleLogout()">Log Out</a>
  `,
})
export class LogoutButtonComponent {
  @Input('stylingClasses') stylingClasses:string = '';

  constructor(
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  handleLogout(): void {
    console.log(this.doc.location.origin)
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}