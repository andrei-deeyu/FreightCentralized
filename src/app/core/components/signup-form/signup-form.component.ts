import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from '../validators/username.validators';

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent {
  form = new FormGroup({
    account: new FormGroup({
      username: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        UsernameValidators.cannotContainSpace,
      ],
      [
        UsernameValidators.shouldBeUnique
      ]),
      password: new FormControl('', Validators.required),
      admin: new FormControl(false)
    })
  });

/*
constructor(fb: FormBuilder) {
  this.form = fb.group({
    name: ['', Validators.required],
    contact: fb.group({
      email: [],
      phone: []
    }),
    topics: fb.array([])
  })
}
*/

  submit(f: FormGroup) {
  let account = f.controls['account'] as FormGroup;
  let admin = account.controls['admin'] as FormControl;
  console.log(admin.value)
  console.log(typeof admin.value);
}

  login() {
      this.form.setErrors({
        inValidLogin: true
      });
  }

   get username() {
    return this.form.get('account.username');
  }
}
