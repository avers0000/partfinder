import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../shared/product.model';
import { CartService } from '../../../cart/cart.service';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.css']
})
export class ProductListItemComponent implements OnInit {
  @Input() product: Product;

  header: string = '';
  imgPath: string = '';
  imgCount: string;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit() {
    this.header = `${this.product.group.caption} для ${this.product.manufacturer.caption} ${this.product.model.caption}${(this.product.code.length > 0) ? ' (' + this.product.code + ')' : ''}`
    this.imgPath = (this.product.photos && this.product.photos.length > 0) ? this.product.photos[0] : 'http://atom96.ru/wp-content/uploads/2017/10/%D0%BD%D0%B5%D1%82-%D1%84%D0%BE%D1%82%D0%BE.png';
    this.imgCount = `${(this.product.photos && this.product.photos.length > 0) ? this.product.photos.length : 'Нет'} фото`;
  }

  navigateToProductPage(): void {
    this.router.navigate([
      '/catalog', 
      this.product.manufacturer.name, 
      this.product.model.name, 
      this.product.category.name, 
      this.product.group.name, 
      this.product.id
    ]);
  }

  addToCartClick(): void {
    this.cartService.addItem(this.product.id);
  }
}
