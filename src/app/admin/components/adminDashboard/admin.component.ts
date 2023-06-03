import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  user$ = this.authService.user$;
  isAdmin: boolean = false;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.user$.subscribe(user => this.isAdmin = user?.[environment.idtoken_namespace].admin)
  }
}
