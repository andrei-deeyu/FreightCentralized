import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthApiService } from 'sharedServices/auth.api.service';

@Component({
  selector: 'get-subscription',
  templateUrl: './get-subscription.component.html',
  styleUrls: ['./get-subscription.component.scss']
})
export class GetSubscriptionComponent {
  Object = Object;
  subscriptionsAvailable = {
    shipper: {
      desc: 'Businesses looking to ship their goods and list freight requirements.',
      price: 0
    },
    carrier: {
      desc: 'Transportation companies and freight carriers interested in finding freight to transport.',
      price: 0,
    },
    forwarder: {
      desc: 'Companies specializing in arranging transportation and handling logistics for shippers',
      price: 0
    },
    logistic: {
      desc: 'Businesses providing comprehensive logistics services.',
      price: 0
    }
  }

  constructor(
    private authService: AuthService,
    private service: AuthApiService
    ) {}

  getSubscription(type: string) {
    this.service.changeSubscription(type)
      .subscribe({
        next: (result: {[index: string]:Object}) => {
          console.log(result)
          if(result['status'] == 'changed')
            console.log(result);
            this.authService.loginWithRedirect({
              appState: {
                target: '/profile',
              },
            });
          }
      })
  }

  asIsOrder(a: any, b: any) {
    return 1;
  }
}
