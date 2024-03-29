import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentPage } from 'src/app/state/exchange.selectors';
import { ExchangeApiService } from '../../services/exchange.api.service';
import { Exchange } from '@shared/models/exchange.model';
import { ExchangeApiActions, pageActiveActions } from 'src/app/state/exchange.actions';
import { CurrentPage } from '@shared/models/currentPage.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  currentPage$ = this.store.select(selectCurrentPage);
  selectedPagination = 0;
  pagesToShow = 0;
  @Input() filtersObs!: Observable<object>;

  constructor (
    private service: ExchangeApiService,
    private store: Store
  ) { }

  ngOnInit() {
    this.filtersObs.subscribe((filters) => this.getFirstPage(filters));
  }

  getFirstPage(filters: object) {
    this.service.getAll(1, filters)
    .subscribe(( response ) => {
      this.pagesToShow = response.pagesToShow;

      const exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }

  public changePage(choosePage: number) {
    this.service.getAll(choosePage, {}) // , filters
    .subscribe(( response ) => {
      this.pagesToShow = response.pagesToShow;

      const currentPage:CurrentPage = { pageActive: response.pageActive } ;
      this.selectedPagination = response.pageActive;
      this.store.dispatch(pageActiveActions.changePage({ currentPage }))

      const exchange:Exchange[] = response.result
      this.store.dispatch(ExchangeApiActions.retrievedExchangePosts({ exchange }))
    });
  }
}
