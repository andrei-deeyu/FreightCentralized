import { createReducer, on } from '@ngrx/store';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiActions, ExchangeNotificationsActions, SinglePostApiActions, pageActiveActions } from './exchange.actions';
import { CurrentPage } from '@shared/models/currentPage.model';

export const initialState: Array<Exchange> = [];

export const pageActiveInitialState: CurrentPage = { pageActive: 1 };

export const SinglePostInitialState: Exchange = {
  userId: 0,
  _id: '',
  title: '',
  body: '',
  createdAt: new Date()
};
export const ExchangeNotificationsInitialState: Exchange = {
  userId: 0,
  _id: '',
  title: '',
  body: '',
  createdAt: new Date()
}

export const exchangeReducer = createReducer(
  initialState,

  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => exchange),
  on(ExchangeApiActions.addPost, (_state, { post }) => {
    console.log('ah')
    if (_state.indexOf(post) > -1) return _state;

    //return _state.filter((value, index) => index !== _state.length)
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

export const ExchangeNotificationReducer = createReducer(
  ExchangeNotificationsInitialState,

  on(ExchangeNotificationsActions.addNotification, (_state, { post }) => post),
  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => exchange[0]),
  on(ExchangeNotificationsActions.removeNotification, () => ExchangeNotificationsInitialState)
)

export const currentPageReducer = createReducer(
   pageActiveInitialState,

  on(pageActiveActions.changePage, (_state, { currentPage }) => currentPage)
)