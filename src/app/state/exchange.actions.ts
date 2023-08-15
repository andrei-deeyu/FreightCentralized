import { createActionGroup, props } from '@ngrx/store';
import { Exchange } from '@shared/models/exchange.model';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Bid } from '@shared/models/bid.model';
import { Contract } from '@shared/models/contract.model';


export const ExchangeApiActions = createActionGroup({
  source: 'Exchange API',
  events: {
    'Retrieved Exchange Posts': props<{ exchange: Array<Exchange> }>(),
    'Add Post': props<{ post: Exchange }>(),
    'Remove Post': props<{postId: string}>(),
    'Like Post': props<{postId: string, eventValue: boolean}>()
  },
});

export const SinglePostApiActions = createActionGroup({
  source: 'Single Post API',
  events: {
    'Init Single Post': props<any>(),
    'Retrieved Single Post': props<{ singlePost: Exchange }>(),
    'Mark As Contracted': props<any>()
  },
});

export const BidApiActions = createActionGroup({
  source: 'Bid API',
  events: {
    'Add Bid': props<{ bid: Bid }>(),
    'Remove Bid': props<{bidId: string}>()
  },
});

export const ExchangeNotificationsActions = createActionGroup({
  source: 'Exchange Notifications',
  events: {
    'Remove Notification': props<any>(),
    'Add Notification': props<{post: Exchange}>()
  },
});

export const ContractNotificationsActions = createActionGroup({
  source: 'Contract Notification Actions',
  events: {
    'Remove Notification': props<any>(),
    'Add Notification': props<{ data: Contract }>()
  }
});

export const pageActiveActions = createActionGroup({
  source: 'Current Page',
  events: {
    'Change Page': props<{ currentPage: CurrentPage }>(),
  },
});