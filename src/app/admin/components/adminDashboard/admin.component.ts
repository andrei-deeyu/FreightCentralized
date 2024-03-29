import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user$ = this.authService.user$;
  isAdmin = false;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.user$.subscribe(user => this.isAdmin = user?.[`${environment.idtoken_namespace}app_metadata`]?.admin)
  }
}
