import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'contract-date-picker',
  templateUrl: './contract-date-picker.component.html',
  standalone: true,
  styleUrls: ['./contract-date-picker.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class ContractDatePickerComponent implements OnInit {
  @Output() transportationDate = new EventEmitter<any>();
  dateRange = new FormGroup({
    pickup: new FormControl<Date | null>(null, [ Validators.required ]),
    delivery: new FormControl<Date | null>(null, [ Validators.required ]),
  });

  ngOnInit() {
    this.dateRange.valueChanges.subscribe((value) => {
      this.transportationDate.next(value);
    })
  }
}