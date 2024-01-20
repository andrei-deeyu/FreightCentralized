import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DeviceInfo } from '@shared/types/device-info.interface';
import { PublicApiService } from 'sharedServices/public-api.service';

@Component({
  selector: 'signup-button',
  template: `
    <button [class]="stylingClasses" (click)="handleSignUp(text)">{{ text }}</button>
  `,
})
export class SignupButtonComponent {
  @Input() stylingClasses = '';
  @Input() text = 'Inregistrare';

  constructor(
    private auth: AuthService,
    private publicService: PublicApiService
  ) {}

  handleSignUp(CTAText: string): void {
    const deviceInfo: DeviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      platform: navigator.platform,
    }

    this.publicService.signupLog(CTAText, deviceInfo);

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