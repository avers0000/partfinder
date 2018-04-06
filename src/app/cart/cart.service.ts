import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { HttpClient } from '@angular/common/http';

import { CatalogService } from "../catalog/catalog.servise";
import { OrderItem } from "../shared/order-item.model";
import { Order, OrderStatus } from "../shared/order.model";
import { Product } from "../shared/product.model";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class CartService {
    cartChanged: Subject<OrderItem[]>;
    private cart: OrderItem[] = [];

    constructor(private catalogService: CatalogService, private http: HttpClient, private authService: AuthService) {
        this.cartChanged = new Subject<OrderItem[]>();
    }

    getCartItems(): OrderItem[] {
        return this.cart;
    }

    addItem(productId: number, quantity: number = 1): void {
        const existingItemIndex = this.cart.findIndex((item) => item.productId === productId);

        if (existingItemIndex >= 0) {
            this.cart[existingItemIndex].quantity += quantity;
            this.cartChanged.next(this.cart);
        }
        else {
            this.catalogService.getProductByIdAsync(productId).subscribe((product: Product) => {
                this.cart.push(new OrderItem(productId, product.group.caption + ' ' + product.code, product.price, quantity));
                this.cartChanged.next(this.cart);
            });
        }
    }

    deleteItem(productId: number): void {
        const existingItemIndex = this.cart.findIndex((item) => item.productId === productId);

        if (existingItemIndex >= 0) {
            this.cart.splice(existingItemIndex, 1);
            this.cartChanged.next(this.cart);
        }
    }

    updateQuantity(data: {productId: number, quantity: number}): void {
        const existingItemIndex = this.cart.findIndex((item) => item.productId === data.productId);

        if (existingItemIndex >= 0) {
            this.cart[existingItemIndex].quantity = data.quantity;
            this.cartChanged.next(this.cart);
        }
    }

    clearCart(): void {
        this.cart = [];
        this.cartChanged.next(this.cart);
    }

    createOrder() {
        let userId = null;
        if (this.authService.user) userId = this.authService.user.userId;
        if (!userId) throw('User not found');
        let order = new Order();
        order.createdDate = new Date();
        order.status = OrderStatus.Pending;
        order.items = this.cart.slice();

        return this.http.post(`https://partfinder-8bf92.firebaseio.com/users/${userId}/orders.json`, order);
    }
}