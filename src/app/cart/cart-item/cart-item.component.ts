import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../shared/product.model';
import { CatalogState } from '../../catalog/catalog-state.model';
import { CartService } from '../cart.service';
import { CatalogService } from '../../catalog/catalog.servise';
import { OrderItem } from '../../shared/order-item.model';

@Component({
  selector: '[app-cart-item]',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: OrderItem;
  currentQuantity: number;

  constructor(private cartService: CartService, private router: Router, private catalogService: CatalogService) {
  }

  ngOnInit() {
    this.currentQuantity = this.cartItem.quantity;
  }

  navigateProduct(): void {
    this.catalogService.getProductByIdAsync(this.cartItem.productId).subscribe((product: Product) => {
      this.router.navigate([
        '/catalog', 
        product.manufacturer.name, 
        product.model.name, 
        product.category.name, 
        product.group.name, 
        product.id
      ]);
    });
  }

  deleteItem(): void {
    this.cartService.deleteItem(this.cartItem.productId);
  }

  changeQuantity(): void {
    this.cartService.updateQuantity({ productId: this.cartItem.productId, quantity: this.currentQuantity });
  }

}
