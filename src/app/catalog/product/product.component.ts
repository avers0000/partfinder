import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CatalogService } from '../catalog.servise';
import { Product } from '../../shared/product.model';
import { CatalogState } from '../catalog-state.model';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  header: String = '';
  @Input() productId: number;
  product: Product;
  selectedImage: number = null;

  constructor(private catalogService: CatalogService, private cartService: CartService, private router: Router) { }

  ngOnInit() {
     this.catalogService.getProductByIdAsync(this.productId).subscribe((product: Product) => {
       this.product = product;
       this.buildHeader();
       if (this.product.photos && this.product.photos.length > 0) this.selectedImage = 0; 
     });
  }

  onImageSelect(i: number): void {
    this.selectedImage = i;
  }

  navigateManufacturer(): void {
    this.router.navigate([
      '/catalog', 
      this.product.manufacturer.name
    ]);
  }

  navigateModel(): void {
    this.router.navigate([
      '/catalog', 
      this.product.manufacturer.name, 
      this.product.model.name
    ]);
  }

  navigateCategory(): void {
    this.router.navigate([
      '/catalog', 
      'category', 
      this.product.category.name
    ]);
  }

  navigateGroup(): void {
    this.router.navigate([
      '/catalog', 
      'category', 
      this.product.category.name,
      this.product.group.name
    ]);
  }

  private buildHeader() {
    let manufacturer = (this.product.manufacturer) ? this.product.manufacturer.caption : '';
    let model = (this.product.model) ? this.product.model.caption : '';
    let category = (this.product.category) ? this.product.category.caption : '';
    let group = (this.product.group) ? this.product.group.caption : '';
    
    if (this.product) {
      this.catalogService.getProductByIdAsync(this.productId).subscribe((product: Product) => {
        this.header = `${group} ${manufacturer} ${model} (${product.code})`;
      });
    }
  }
  
  addToCart(): void {
    this.cartService.addItem(this.product.id);
  }
}
