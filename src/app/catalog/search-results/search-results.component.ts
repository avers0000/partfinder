import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CatalogService } from '../catalog.servise';
import { CatalogState } from '../catalog-state.model';
import { Product } from '../../shared/product.model';
import { Pageable } from '../../shared/pageable.model';
import { CatalogConfig } from '../catalog-config.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  products: Pageable<Product>;
  catalogConfig: CatalogConfig;
  catalogState: CatalogState;
  pages: number[] = [1];
  private subscription: Subscription;

  constructor(private catalogService: CatalogService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.catalogConfig = this.catalogService.getCatalogConfig();
    this.catalogState =  this.catalogService.getCatalogState();
    this.setProducts();
    this.subscription = this.catalogService.catalogStateChanged.subscribe((catalogState: CatalogState) => {
      this.catalogState =  catalogState;
      this.setProducts();
    });
  }

  setProducts(): void {
    this.catalogService.getProductsPageAsync(this.catalogState.page).subscribe((pageable: Pageable<Product>) => {
      this.products = pageable;
      this.loading = false;
      this.setPages();
    });
  }

  setPages(): void {
    let pages: number[] = [];
    let pageNumber: number;
    let pageSize = (this.catalogConfig.extendedView) ? this.catalogConfig.extendedPageSize : this.catalogConfig.pageSize;


    if (this.products && pageSize) {
      pageNumber = Math.ceil(this.products.total / pageSize);
      for (let i = 1; i < pageNumber + 1; i++) {
        pages.push(i);
      }
    }
    else {
      pages.push(1);
    }
    this.pages = pages;
  }

  onPageSelect(page: number): void {
    if (page > 1) {
      this.router.navigate([], {relativeTo: this.route,  queryParams: { page: page }, queryParamsHandling: 'merge'});
    }
    else {
      this.router.navigate([], {relativeTo: this.route,  queryParams: { page: null }, queryParamsHandling: 'merge'});
    }
  }
  
  toggleView() {
    this.catalogConfig.extendedView = !this.catalogConfig.extendedView;
    this.router.navigate([], {relativeTo: this.route,  queryParams: { page: null }, queryParamsHandling: 'merge'});
  }

  setView(extended: boolean): void {
    this.catalogConfig.extendedView = extended;
    this.router.navigate([], {relativeTo: this.route,  queryParams: { page: null }, queryParamsHandling: 'merge'});
    this.catalogService.catalogStateChanged.next(this.catalogState);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
