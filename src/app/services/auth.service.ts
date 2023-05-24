import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {
  constructor(
    private JwtHelper: JwtHelperService,
    private http: HttpClient) {}

  login(credentials: object) {
    return this.http.post('/api/authenticate', credentials);
  }

  logout() {
    localStorage.removeItem('token');
  }

  get currentUser() {
    return this.JwtHelper.decodeToken();
  }

  isLoggedIn() {
    return !this.JwtHelper.isTokenExpired();
  }
}