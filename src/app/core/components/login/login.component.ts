import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

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

    logIn(credentials: Object) {
      this.authService.login(credentials)
        .subscribe(( result:{ [index: string]:Object }) => {
          let token: string = result?.['token'].toString();

          if( token ) {
            localStorage.setItem('token', token);
            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

            this.router
              .navigate([returnUrl ?? '/'])
              .catch((err) => { throw err });
          }
          this.invalidLogin = true;
          return false;
        });
    }
  }