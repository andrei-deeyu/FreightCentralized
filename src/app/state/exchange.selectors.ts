import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Exchange } from '@shared/models/exchange.model';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Bid } from '@shared/models/bid.model';
import { Contract } from '@shared/models/contract.model';

export const selectExchange = createFeatureSelector<Array<Exchange>>('exchange');
export const selectSinglePost = createFeatureSelector<Exchange>('singlePost');
export const selectBid = createFeatureSelector<Bid>('bid');
export const selectExchangeNotifications = createFeatureSelector<Exchange>('exchangeNotifications');
export const selectContractNotifications = createFeatureSelector<Contract>('contractNotifications')
export const selectCurrentPage = createFeatureSelector<CurrentPage>('currentPage');