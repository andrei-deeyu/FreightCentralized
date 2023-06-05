import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoAccessComponent } from './core/components/no-access/no-access.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { SignupFormComponent } from './core/components/signup-form/signup-form.component';
import { SignupComponent } from './core/components/signup/signup.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'form-test', component: SignupFormComponent },
  { path: 'no-access', component: NoAccessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
