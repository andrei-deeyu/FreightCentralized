import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContractDataComponent } from './components/contract-data/contract-data.component';
import { ContractsApiService } from './services/contracts.api.service';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { SharedModule } from '@shared/shared.module';
import { ContractDatePickerComponent } from './components/contract-date-picker/contract-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '@auth0/auth0-angular';


@NgModule({
  declarations: [
    ContractDataComponent,
    ContractListComponent,
  ],
  providers: [
    ContractsApiService
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContractDatePickerComponent,
    RouterModule.forChild([
      { path: 'contracts', canActivate: [AuthGuard], component: ContractListComponent },
      { path: 'contracts/:id', canActivate: [AuthGuard], component: ContractDataComponent },
    ])
  ]
})
export class ContractsModule { }
