import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment, ParamMap} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CatalogService } from './catalog.servise';
import { CatalogState } from './catalog-state.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
  header: String = 'Каталог';
  catalogState: CatalogState;
  private routeSubscription;
  private querySubscription;
  private catalogStateSubscription: Subscription;

  constructor(private catalogService: CatalogService, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('init: ' + this.catalogState);
    //this.catalogState = this.catalogService.getCatalogState();
    this.catalogStateSubscription = this.catalogService.catalogStateChanged.subscribe((catalogState: CatalogState) => {
      this.catalogState = catalogState;
      this.buildHeader();
      console.log('cat change:');
      console.log(catalogState);
    });

    this.routeSubscription = this.route.url.subscribe((url: UrlSegment[]) => {
      console.log('url changed');
      let search: string = this.route.snapshot.queryParams['search'];
      let page: number = +this.route.snapshot.queryParams['page'];
      // console.log(search)
      this.catalogService.parseCatalogStateFromRouteAsync(url, (search && search.trim().length) > 0 ? search.trim() : '', page > 1 ? page : null);
    });

    this.querySubscription = this.route.queryParamMap.subscribe((params: ParamMap) => {
      console.log('queryy change:');
      let search = params.get('search');
      let page: number = +params.get('page');
      this.catalogService.setCatalogStateParams((search && search.trim().length > 0) ? search.trim() : '', page > 1 ? page : null);
    });
  }

  private buildHeader() {
    if (this.catalogService.catalogStateHasValues()) {
      let manufacturer = (this.catalogState.manufacturer) ? this.catalogState.manufacturer.caption : '';
      let model = (this.catalogState.model) ? this.catalogState.model.caption : '';
      let category = (this.catalogState.category) ? this.catalogState.category.caption : '';
      let group = (this.catalogState.group) ? this.catalogState.group.caption : '';
      
      if (this.catalogState.searchBy === 'model') {
        this.header = `${manufacturer} ${model} ${(group.length > 0) ? ('- ' + group) : (category.length > 0) ? ('- ' + category) : ''}`;
      }
      else {
        this.header = `${(manufacturer.length > 0) ? manufacturer + ' -' : ''} ${(group.length > 0) ? (group) : (category.length > 0) ? (category) : ''}`;        
      }
    }
    else {
      this.header = 'Каталог';
    }
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.catalogStateSubscription.unsubscribe();
    if (this.catalogService.catalogStateHasValues) {
      this.catalogService.clearCatalogState();
    }
  }
}
