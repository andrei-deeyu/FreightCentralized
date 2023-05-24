import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { UsernameValidators } from './username.validators';

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

      //([admin, regular], Validators.required)
    })
  });

/* = new FormGroup({
    name: new FormControl('', Validators.required),
    contact: new FormGroup({
      email: new FormControl(),
      phone: new FormControl()
    }),
    topics: new FormArray([])
  })
*/
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

  dadada(f: FormGroup) {
  let account = f.controls['account'] as FormGroup;
  let admin = account.controls['admin'] as FormControl;
console.log(admin.value)
console.log(typeof admin.value)
  // console.log(admin.controls[0].value);
  // console.log(admin.controls[1].value);
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
