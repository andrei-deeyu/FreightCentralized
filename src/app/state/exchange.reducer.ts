import { createReducer, on } from '@ngrx/store';
import { Exchange, ExchangeMockup } from '@shared/models/exchange.model';
import { BidApiActions, ExchangeApiActions, ExchangeNotificationsActions, SinglePostApiActions, pageActiveActions } from './exchange.actions';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Bid, BidMockup } from '@shared/models/bid.model';

export const initialState: Array<Exchange> = [];

export const pageActiveInitialState: CurrentPage = { pageActive: 1 };

export const SinglePostInitialState: Exchange = ExchangeMockup;
export const BidInitialState: Bid = BidMockup;
export const ExchangeNotificationsInitialState: Exchange = ExchangeMockup;

export const exchangeReducer = createReducer(
  initialState,

  on(ExchangeApiActions.retrievedExchangePosts, (_state, { exchange }) => exchange),
  on(ExchangeApiActions.addPost, (_state, { post }) => {
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

export const BidReducer = createReducer(
  BidInitialState,

  on(BidApiActions.addBid, (_state, { bid }) => {
    console.log('add bidd')
    return bid;
  }),
  on(BidApiActions.removeBid, (_state, { bidId }) => {
    console.log('remove bid')
    return {
      ...BidInitialState,
      _id: bidId
    }
  })
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