import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';
import { CurrentPage } from '../shared/models/currentPage.model';

export const selectExchange = createFeatureSelector<Array<Exchange>>('exchange');
export const selectSinglePost = createFeatureSelector<Exchange>('singlePost');
export const selectNotification = createFeatureSelector<Exchange>('notification');
export const selectCurrentPage = createFeatureSelector<CurrentPage>('currentPage');