import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'signup-button',
  template: `
    <button [class]="stylingClasses" (click)="handleSignUp()">Sign Up</button>
  `,
})
export class SignupButtonComponent {
  @Input('stylingClasses') stylingClasses:string = '';

  constructor(private auth: AuthService) {}

  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/exchange',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
}