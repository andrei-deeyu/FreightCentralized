import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Exchange } from '../dashboard/models/exchange.model';

export const selectExchange = createFeatureSelector<Array<Exchange>>('exchange');