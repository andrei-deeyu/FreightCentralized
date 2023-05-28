import { createReducer, on } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';
import { ExchangeApiActions } from './exchange.actions';

// export const initialState: ReadonlyArray<Exchange> = [];

export const initialState: Array<Exchange> = []

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
    state.filter((chestie1, index, chestie3) => chestie1.id !== postId)),

    on(ExchangeApiActions.likePost, (state, { postId, eventValue }) =>
      state.map((value, index) => value.id === postId ? {...value, isLiked: eventValue } : value)
  )



    //state.filter((chestie1, index, chestie3) => chestie1.id !== postId),
    /*
    on(ExchangeApiActions.likePost, (state, { postId, eventValue }) => {
      let thePost = state.indexOf()
      if (_state.indexOf(postId) > -1) return _state;
      return [ post, ..._state];
    }),
    */

);