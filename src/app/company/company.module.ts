import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CompanyProfileApiService } from './services/company-profile.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  providers: [
    CompanyProfileApiService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'company', canActivate: [AuthGuard], component: ProfileComponent }
    ])
  ]
})
export class CompanyModule { }
