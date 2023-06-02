import { createActionGroup, props } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';
import { CurrentPage } from '../shared/models/currentPage.model';


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
  },
});

export const ExchangeNotificationsActions = createActionGroup({
  source: 'Exchange Notifications',
  events: {
    'Remove Notification': props<any>(),
    'Add Notification': props<{post: Exchange}>()
  },
});

export const pageActiveActions = createActionGroup({
  source: 'Current Page',
  events: {
    'Change Page': props<{ currentPage: CurrentPage }>(),
  },
});