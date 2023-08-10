import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      }
    });
  }
}