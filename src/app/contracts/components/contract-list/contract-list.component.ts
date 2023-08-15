import { Component } from '@angular/core';
import { ContractsApiService } from '../../services/contracts.api.service';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent {
  contracts!: Array<any>;
  user$ = this.authService.user$;
  confirmContractAlertIndex = -1;
  transportationDate = {
    pickup: undefined,
    delivery: undefined
  }

  constructor(
    private service: ContractsApiService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getContracts()
  }

  getContracts() {
    this.service.getContracts()
      .subscribe({
        next: (contracts: Array<object>) => {
          this.contracts = contracts
        },
        error: (err) => { throw err; }
      })
  }

  confirmContract(contractId: string) {
    this.service.confirmContract(contractId, this.transportationDate)
      .subscribe({
        next: (confirmedContract: object) => {
          this.contracts[this.confirmContractAlertIndex] = confirmedContract;
          this.confirmContractAlertIndex = -1;
          this.transportationDate.pickup = undefined;
          this.transportationDate.delivery = undefined;
        }
      })
  }
}