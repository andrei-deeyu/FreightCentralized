import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'signup-button',
  template: `
    <button [class]="stylingClasses" (click)="handleSignUp()">{{ text }}</button>
  `,
})
export class SignupButtonComponent {
  @Input('stylingClasses') stylingClasses:string = '';
  @Input('text') text:string = 'Sign Up';

  constructor(private auth: AuthService) {}

  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/profile',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
}