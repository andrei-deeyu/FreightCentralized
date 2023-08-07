import { Exchange } from '@shared/models/exchange.model';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Bid } from '@shared/models/bid.model';

export interface AppState {
  exchange: Array<Exchange>,
  singlePost: Exchange,
  bid: Bid,
  exchangeNotifications: Exchange,
  currentPage: CurrentPage
}