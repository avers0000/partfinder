import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../shared/product.model';
import { CatalogService } from '../../catalog/catalog.servise';
import { CatalogState } from '../../catalog/catalog-state.model';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[];
  @Input() extended: boolean = false;
  constructor() { }

  ngOnInit() {
  }
}
