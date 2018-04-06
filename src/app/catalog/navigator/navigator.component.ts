import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CatalogMenuItem } from '../catalog-menu-item.model';
import { CatalogService } from '../catalog.servise';
import { CatalogState } from '../catalog-state.model';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  menuItems: CatalogMenuItem[] = [];
  selectedmenuItemName: string = '';

  private subscription: Subscription;

  constructor(private catalogService: CatalogService) { }

  ngOnInit() {
    this.catalogService.getManufacturerListAsync().subscribe((items: CatalogMenuItem[]) => {
      this.menuItems = items;
    });
    this.subscription = this.catalogService.catalogStateChanged.subscribe((catalogState: CatalogState) => {
      if (catalogState.manufacturer) {
        this.selectedmenuItemName = catalogState.manufacturer.name;
      }
      else {
        this.selectedmenuItemName = '';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
