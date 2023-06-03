import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './components/adminDashboard/admin.component';

import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AuthGuard } from '@auth0/auth0-angular';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [ AuthGuard ],
      },
    ])
  ],
  exports: [
  ]
})
export class AdminModule { }
