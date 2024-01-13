import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AuthApiService } from 'sharedServices/auth.api.service';

@Component({
  selector: 'get-subscription',
  templateUrl: './get-subscription.component.html',
  styleUrls: ['./get-subscription.component.scss']
})
export class GetSubscriptionComponent {
  subscriptionsAvailable = {
    shipper: {
      desc: 'Afaceri ce doresc sa expedieze marfurile si sa listeze cereri de transport.',
      price: 0,
      color: '#FFD6D6',
    },
    carrier: {
      desc: 'Transportatori interesati sa gaseasca marfuri de transportat.',
      price: 0,
      color: '#D6E4FF'
    },
    forwarder: {
      desc: 'Afaceri specializate in aranjarea transportului si manipularii logisticii pentru expeditori',
      price: 0,
      color: '#FFF9D6',
    },
    logistic: {
      desc: 'Companii care oferă servicii logistice complete.',
      price: 0,
      color: '#D6FFE4'
    }
  }

  constructor(
    private authService: AuthService,
    private service: AuthApiService
    ) {}

  getSubscription(type: string) {
    this.service.changeSubscription(type)
      .subscribe({
        next: (result: { state: string }) => {
          if(result.state == 'changed')
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
