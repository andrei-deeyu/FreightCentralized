import { createActionGroup, props } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';


export const ExchangeApiActions = createActionGroup({
  source: 'Exchange API',
  events: {
    'Retrieved Exchange Posts': props<{ exchange: Array<Exchange> }>(),
    'Add Post': props<{ post: Exchange }>(),
    'Remove Post': props<{postId: number}>(),
    'Like Post': props<{postId: number, eventValue: boolean}>()
  },
});
