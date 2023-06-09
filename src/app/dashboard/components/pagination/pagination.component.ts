import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPage } from 'src/app/state/exchange.selectors';
import { ExchangeApiService } from '../../services/exchange.api.service';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiActions, pageActiveActions } from 'src/app/state/exchange.actions';
import { CurrentPage } from '@shared/models/currentPage.model';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  currentPage$ = this.store.select(selectCurrentPage);
  selectedPagination = 0;
  pagesToShow:number = 0;

  constructor (
    private service: ExchangeApiService,
    private store: Store
  ) { }

  ngOnInit() {
    this.service.getAll(1)
    .subscribe(( response ) => {
      this.pagesToShow = response.pagesToShow;

      let exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  public changePage(choosePage: number) {
    this.service.getAll(choosePage)
    .subscribe(( response ) => {
      this.pagesToShow = response.pagesToShow;

      let currentPage:CurrentPage = { pageActive: response.pageActive } ;
      this.selectedPagination = response.pageActive;
      this.store.dispatch(pageActiveActions.changePage({ currentPage }))

      let exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }
}
