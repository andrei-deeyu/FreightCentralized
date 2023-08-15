import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { AppError } from 'sharedServices/Errors/app-error';
import { BadInput } from 'sharedServices/Errors/bad-input';
import { AuthApiService } from 'sharedServices/auth.api.service';


@Component({
  selector: 'contact-data',
  templateUrl: './contact-data.component.html',
  styleUrls: ['./contact-data.component.scss']
})
export class ContactDataComponent {
  phoneNumberRegEx = '^[0-9]{8,15}$';

  form = new FormGroup({
    firstName: new FormControl('',
    [
      Validators.required,
      Validators.min(3),
    ]),
    lastName: new FormControl('',
    [
      Validators.required,
      Validators.min(3),
    ]),
    phoneNumber: new FormControl(null,
    [
      Validators.required,
      Validators.pattern(this.phoneNumberRegEx),
    ])
  });

  constructor(
    private authService: AuthService,
    private service: AuthApiService
  ) {}

  saveProfile(f: FormGroup) {
    const firstName = f.get('firstName')?.value;
    const lastName = f.get('lastName')?.value;
    const profile = {
      name: firstName + " " + lastName,
      phoneNumber: String(f.get('phoneNumber')?.value)
    }
    if(!firstName || !lastName || !profile.phoneNumber) {
      return this.form.setErrors(new BadInput('Both name and phone number are required').message)
    }

    this.service.saveProfile(profile.name, profile.phoneNumber)
    .subscribe({
      next: (result: { state: string }) => {
        console.log(result)
        if(result.state == 'changed')
          this.authService.loginWithRedirect({
            appState: {
              target: '/profile',
            },
          });
        },
      error: (error: AppError) => {
        this.form.setErrors(error.originalError.error.message)
      }
    });
  }
}
