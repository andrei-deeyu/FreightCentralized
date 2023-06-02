import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-input-error',
  templateUrl: './form-input-error.component.html',
  styleUrls: ['./form-input-error.component.scss']
})
export class FormInputErrorComponent {
  @Input("control") control:any;
  @Input("controlName") controlName:any;
}
