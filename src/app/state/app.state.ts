import { Exchange } from '@shared/models/exchange.model';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Bid } from '@shared/models/bid.model';
import { Contract } from '@shared/models/contract.model';

export interface AppState {
  exchange: Array<Exchange>,
  singlePost: Exchange,
  bid: Bid,
  exchangeNotifications: Exchange,
  contractNotifications: Contract;
  currentPage: CurrentPage,
}