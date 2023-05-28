import { Exchange } from '../dashboard/models/exchange.model';

export interface AppState {
  exchange: Array<Exchange>, //ReadonlyArray<number>;
  singlePost: Exchange
}