import { state, style, transition, trigger, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-input-error',
  templateUrl: './form-input-error.component.html',
  styleUrls: ['./form-input-error.component.scss'],
  animations: [
    trigger('alert', [
      state('collapsed', style({
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        opacity: 0
      })),


      transition('collapsed => expanded', [
        animate('100ms ease-out', style({ height: '*', paddingTop: '*', paddingBottom: '*' })),
        animate('100ms ease-out', style({ opacity: 1 })),
      ]),
      transition('expanded => collapsed', [
        animate('200ms ease-in', style({ opacity: 0 })),
        animate('200ms ease-in',  style({ height:0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 })),
      ])
     ]),
  ]
})
export class FormInputErrorComponent {
  @Input() control:any;
  @Input() controlName:any;
  @Input() blur:any;
}
