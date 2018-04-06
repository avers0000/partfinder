import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CatalogState } from '../catalog-state.model';
import { CatalogService } from '../catalog.servise';
import { CatalogMenuItem } from '../catalog-menu-item.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit, OnDestroy {
  optionLabel: CatalogMenuItem = new CatalogMenuItem(null, "Все");
  manufacturers: CatalogMenuItem[];
  manufacturerSelected: CatalogMenuItem = this.optionLabel;
  models: CatalogMenuItem[] = [];
  modelSelected: CatalogMenuItem = this.optionLabel;
  categories: CatalogMenuItem[] = [];
  categorySelected: CatalogMenuItem = this.optionLabel;
  groups: CatalogMenuItem[] = [];
  groupSelected: CatalogMenuItem = this.optionLabel;
  searchText: string = '';

  catalogState: CatalogState;
  private subscription: Subscription;

  constructor(private catalogService: CatalogService, private router: Router) { }

  ngOnInit() {
    this.catalogState = this.catalogService.getCatalogState();
    this.catalogService.getManufacturerListAsync().subscribe((items: CatalogMenuItem[]) => this.manufacturers = items);
    this.catalogService.getCategoryListAsync().subscribe((items: CatalogMenuItem[]) => this.categories = items);
    this.setFormValues();

    this.subscription = this.catalogService.catalogStateChanged.subscribe((catalogState: CatalogState) => {
      this.catalogState = this.catalogService.getCatalogState();
      this.setFormValues();
    });
  }

  setFormValues(): void {
    this.manufacturerSelected = (this.catalogState.manufacturer) ? this.catalogState.manufacturer : this.optionLabel;
    this.modelSelected = (this.catalogState.model) ? this.catalogState.model : this.optionLabel;
    //this.models = this.catalogService.getModelListByManufacturerName(this.manufacturerSelected.name);
    this.catalogService.getModelListByManufacturerNameAsync(this.manufacturerSelected.name).subscribe((items: CatalogMenuItem[]) => this.models = items);
    this.categorySelected = (this.catalogState.category) ? this.catalogState.category : this.optionLabel;
    this.groupSelected = (this.catalogState.group) ? this.catalogState.group : this.optionLabel;
    this.catalogService.getGroupListByCategoryNameAsync(this.categorySelected.name).subscribe((items: CatalogMenuItem[]) => this.groups = items);
    this.searchText = this.catalogState.searchText;
  }

  compareMenuItems(item1: CatalogMenuItem, item2: CatalogMenuItem): boolean {
    return item1 && item2 ? item1.name === item2.name : item1 === item2;
  }

  onManufacturerChange() : void {
    this.modelSelected = this.optionLabel;
    if (!this.groupSelected.name) {
      this.categorySelected = this.optionLabel;
    }
    this.submitForm();
  }

  onModelChange(): void {
    this.submitForm();
  }

  onCategoryChange(): void {
    this.groupSelected = this.optionLabel;
    if (!this.modelSelected.name) {
      this.manufacturerSelected = this.optionLabel;
    };
    this.submitForm();
  }

  onGroupChange(): void {
    this.submitForm();
  }

  clearSearch(): void {
    this.searchText = '';
    this.submitForm();
  }
  
  submitForm(): void {
    let urlSegments: string[] = ['/catalog']
    if (this.categorySelected.name && !this.modelSelected.name) {
      urlSegments.push('category');
      urlSegments.push(this.categorySelected.name);
      if (this.groupSelected.name) {
        urlSegments.push(this.groupSelected.name);
        if (this.manufacturerSelected.name) urlSegments.push(this.manufacturerSelected.name);
      }
    }
    else {
      if (this.manufacturerSelected.name) {
        urlSegments.push(this.manufacturerSelected.name);
        if (this.modelSelected.name) {
          urlSegments.push(this.modelSelected.name);
          if (this.categorySelected.name) {
            urlSegments.push(this.categorySelected.name);
            if (this.groupSelected.name) urlSegments.push(this.groupSelected.name);
          }
        }
      }
    }

    if (this.searchText.trim().length > 0) {
      this.router.navigate(urlSegments, {queryParams: {search: this.searchText.trim()}});
    }
    else {
      this.router.navigate(urlSegments);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
