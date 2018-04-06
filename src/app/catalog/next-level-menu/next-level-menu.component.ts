import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CatalogService } from '../catalog.servise';
import { CatalogState } from '../catalog-state.model';
import { CatalogMenu } from '../catalog-menu.model';
import { CatalogMenuItem } from '../catalog-menu-item.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-next-level-menu',
  templateUrl: './next-level-menu.component.html',
  styleUrls: ['./next-level-menu.component.css']
})
export class NextLevelMenuComponent implements OnInit, OnDestroy {
  @Input() menuType: string = null;
  menu: CatalogMenu = null;
  show: boolean = true;

  private subscription: Subscription;

  constructor(private catalogService: CatalogService, private router: Router) { }

  ngOnInit() {
    this.catalogService.getNextLevelMenuAsync(this.menuType).subscribe((menu) => this.menu = menu);
    this.subscription = this.catalogService.catalogStateChanged.subscribe((catalogState: CatalogState) => {
      console.log('nlm state cjhange');
      this.catalogService.getNextLevelMenuAsync().subscribe((menu) => this.menu = menu);
    });
  }
  
  onItemClick(item: CatalogMenuItem) {
    const catalogState = this.catalogService.getCatalogState();

    switch (this.menu.name) {
      case 'manufacturer':
        if (catalogState.searchBy === 'category' && catalogState.category && catalogState.group) {
          this.router.navigate(['/catalog', 'category', catalogState.category.name, catalogState.group.name, item.name]);          
        }
        else {
          this.router.navigate(['/catalog', item.name]);
        }
        break;
      case 'model':
        if (catalogState.manufacturer) {
          if (catalogState.searchBy === 'category' && catalogState.category) {
            if (catalogState.group) {
              this.router.navigate(['/catalog', catalogState.manufacturer.name, item.name, catalogState.category.name, catalogState.group.name]);          
            }
            else {
              this.router.navigate(['/catalog', catalogState.manufacturer.name, item.name, catalogState.category.name]);          
            }
          }
          else {
            this.router.navigate(['/catalog', catalogState.manufacturer.name, item.name]);
          }
        }
        break;
      case 'category':
        if (catalogState.manufacturer && catalogState.model) {
          this.router.navigate(['/catalog', catalogState.manufacturer.name, catalogState.model.name, item.name]);          
        }
        else {
          this.router.navigate(['/catalog', 'category', item.name]);          
        }
        break;
      case 'group':
        if (catalogState.category){
          if (catalogState.manufacturer && catalogState.model) {
            this.router.navigate(['/catalog', catalogState.manufacturer.name, catalogState.model.name, catalogState.category.name, item.name]);          
          }
          else {
            this.router.navigate(['/catalog', 'category', catalogState.category.name, item.name]);          
          }
        }
        break;
      default:
        break;
    }
  }

  toggleCollapse() {
    this.show = !this.show
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
