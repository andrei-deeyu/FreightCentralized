import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'login-button',
  template: `
    <a [class]="stylingClasses" (click)="handleLogin()" (keyup.enter)="handleLogin()" tabindex="0">Log In</a>
  `,
})
export class LoginButtonComponent {
  constructor(private auth: AuthService) {}
  @Input() stylingClasses = '';

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/profile',
      },
    });
  }
}