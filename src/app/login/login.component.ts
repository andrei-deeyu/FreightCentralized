import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  invalidLogin: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }

    signIn(credentials: any) {
      this.authService.login(credentials)
        .subscribe(( result: any ) => {
          if(result && result.token) {
            localStorage.setItem('token', result.token);

            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            this.router.navigate([returnUrl || '/']);
          }
          this.invalidLogin = true;
          return false;
        });
    }
  }