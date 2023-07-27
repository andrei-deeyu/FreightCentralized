import { Component } from '@angular/core';
import { CompanyProfileApiService } from '../../services/company-profile.api.service';
import { Company } from '@shared/models/company.model';
import { User } from '@shared/models/user.model';

import { ViewChild, ElementRef } from '@angular/core';
import { debounceTime, map, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { BadInput } from 'sharedServices/Errors/bad-input';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  company!: Company;
  companyLoaded: boolean = false;
  new_employee: User = {
    userId: '',
    email: '',
    picture: '',
    name: ''
  }
  form_createNewCompany = new FormGroup({
    name: new FormControl(''),
    cui: new FormControl(null)
  })

  @ViewChild('userSearchInput', { static: true })
  userSearchInput!: ElementRef;
  arrowkeyLocation:number = 0;
  apiResponse: any;
  isSearching: boolean;
  successMessage: string = '';

  constructor(private service: CompanyProfileApiService) {
    this.isSearching = false;
    this.apiResponse = [];
  }

  ngOnInit() {
    this.getCompany();

  }
  ngAfterViewInit() {
    this.createUserSearchEvent();
  }

  getCompany() {
    this.service.getSingle().subscribe({
      next: (res) => {
        this.company = res;
        this.companyLoaded = true;
        return res;
      },
      error: (err) => console.log(err)
    })
  }

  createUserSearchEvent() {
    fromEvent(this.userSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        filter((res) => res.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.isSearching = true;
          return this.service.searchUsers(term);
        })
      )
      .subscribe({
        next: (res) => {
          this.isSearching = false;
          this.arrowkeyLocation = 0;
          this.apiResponse = res;
        },
        error: (err) => {
          this.isSearching = false;
          console.error('error', err);
        },
      });
  }

  searchReponseSelector(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if(this.arrowkeyLocation > 0)
            this.arrowkeyLocation--;
        break;
      case 'ArrowDown':
        if(this.arrowkeyLocation < this.apiResponse.length - 1)
            this.arrowkeyLocation++;
        break;
      case 'Enter':
        this.addEmployee();
      }
  }

  clearSearchReponseSelector() {
    this.isSearching = false;
    this.arrowkeyLocation = 0;
    this.apiResponse = null;
    this.userSearchInput.nativeElement.value = '';
  }

  createCompany(f: FormGroup) {
    let newCompany = {
      name: f.value.name,
      cui: f.value.cui
    }

    this.service.create(newCompany).subscribe({
      next: (res) => {
        this.successMessage = res.name + ' added successfully';
        setTimeout(() => {
          this.successMessage = '';
          f.reset();
          this.company = res;
        }, 3000);
      },
      error: (err) => { throw new BadInput(err.message.error.message)}
    });
  }



  addEmployee() {
    this.new_employee = this.apiResponse[this.arrowkeyLocation];
    this.clearSearchReponseSelector();

    this.service.addEmployee(this.new_employee, this.company._id).subscribe({
      next: (res: { state: string }) => {
        if(res.state == 'added') {
          for (let i = 0; i < this.company.employees.length; i++) {
            const el = this.company.employees[i];
            if(el.userId == this.new_employee.userId)
              throw new BadInput(`${this.new_employee.email} is already hired`)
          }
          this.company.employees.push(this.new_employee);
        }
      },
      error: (err) => console.log(err)
    });
  }
}
