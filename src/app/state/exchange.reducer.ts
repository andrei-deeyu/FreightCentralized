import { createReducer, on } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';
import { ExchangeApiActions, NotificationActions, SinglePostApiActions } from './exchange.actions';
import { map } from 'rxjs/operators';

export const initialState: Array<Exchange> = [];

export const SinglePostInitialState: Exchange = {
  userId: 0,
  id: 0,
  title: '',
  body: ''
};
export const NotificationInitialState: Exchange = {
  userId: 0,
  id: 0,
  title: '',
  body: ''
}

export const exchangeReducer = createReducer(
  initialState,
  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => {
    return exchange;
  }),

  on(ExchangeApiActions.addPost, (_state, { post }) => {
    if (_state.indexOf(post) > -1) return _state;
      return [ post, ..._state];
    }),

    on(ExchangeApiActions.removePost, (state, { postId }) =>
      state.filter((value) => value.id !== postId)),

    on(ExchangeApiActions.likePost, (state, { postId, eventValue }) =>
      state.map((value) => value.id === postId ? {...value, isLiked: eventValue } : value)
  )
);

export const singlePostReducer = createReducer(
  SinglePostInitialState,

  on(SinglePostApiActions.initSinglePost, () => SinglePostInitialState),
  on(SinglePostApiActions.retrievedSinglePost, (_state, { singlePost }) => singlePost),
);

export const notificationReducer = createReducer(
  NotificationInitialState,
  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => exchange[exchange.length-1]),
  on(NotificationActions.removeNotification, () => NotificationInitialState)
)