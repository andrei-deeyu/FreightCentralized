import { Exchange } from '../dashboard/models/exchange.model';
import { CurrentPage } from '../shared/models/currentPage.model';

export interface AppState {
  exchange: Array<Exchange>, //ReadonlyArray<number>;
  singlePost: Exchange,
  notification: Exchange,
  currentPage: CurrentPage
}