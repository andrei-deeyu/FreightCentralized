import { createReducer, on } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';
import { ExchangeApiActions, NotificationActions, SinglePostApiActions } from './exchange.actions';

export const initialState: Array<Exchange> = [];

export const SinglePostInitialState: Exchange = {
  userId: 0,
  _id: '',
  title: '',
  body: '',
  createdAt: new Date()
};
export const NotificationInitialState: Exchange = {
  userId: 0,
  _id: '',
  title: '',
  body: '',
  createdAt: new Date()
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
      state.filter((value) => value._id !== postId)),

    on(ExchangeApiActions.likePost, (state, { postId, eventValue }) =>
      state.map((value) => value._id === postId ? {...value, isLiked: eventValue } : value)
  )
);

export const singlePostReducer = createReducer(
  SinglePostInitialState,

  on(SinglePostApiActions.initSinglePost, () => SinglePostInitialState),
  on(SinglePostApiActions.retrievedSinglePost, (_state, { singlePost }) => singlePost),
);

export const notificationReducer = createReducer(
  NotificationInitialState,
  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => exchange[0]),
  on(ExchangeApiActions.addPost, (_state, { post }) => post),
  on(NotificationActions.removeNotification, () => NotificationInitialState)
)