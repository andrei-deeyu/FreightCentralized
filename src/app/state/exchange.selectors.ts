import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Exchange } from '@shared/models/exchange.model';
import { CurrentPage } from '@shared/models/currentPage.model';

export const selectExchange = createFeatureSelector<Array<Exchange>>('exchange');
export const selectSinglePost = createFeatureSelector<Exchange>('singlePost');
export const selectExchangeNotifications = createFeatureSelector<Exchange>('exchangeNotifications');
export const selectCurrentPage = createFeatureSelector<CurrentPage>('currentPage');