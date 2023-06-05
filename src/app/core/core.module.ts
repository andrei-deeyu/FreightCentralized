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
import { HomeService } from './services/home.service';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    SignupFormComponent,
    NoAccessComponent,
    NotFoundComponent,
    SignupComponent,
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
    HomeService
  ],

  exports: [
    NavbarComponent,
    NotFoundComponent
  ]
})
export class CoreModule { }
