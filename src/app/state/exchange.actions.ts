import { createActionGroup, props } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';


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
    'Init Single Post': props<any>(),//: props(),
    'Retrieved Single Post': props<{ singlePost: Exchange }>(),
  },
});

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Remove Notification': props<any>(),//: props(),
  },
});