import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';

import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthApiService } from '../shared/services/auth.api.service';
import { SearchPostComponent } from './components/search-post/search-post.component';
import { SearchPostMobileComponent } from './components/search-post-mobile/search-post-mobile.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    SignupFormComponent,
    NoAccessComponent,
    NotFoundComponent,
    SignupComponent,
    ProfileComponent,
    SearchPostComponent,
    SearchPostMobileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ],

  providers: [
    FormsModule,
    AuthApiService
  ],

  exports: [
    NavbarComponent,
    NotFoundComponent
  ]
})
export class CoreModule { }
