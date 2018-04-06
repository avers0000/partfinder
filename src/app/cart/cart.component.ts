import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CartService } from './cart.service';
import { OrderItem } from '../shared/order-item.model';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  header: String = 'Корзина';
  cartItems: OrderItem[]=[];
  sum: number = 0;
  subscription: Subscription;
  authSubscription: Subscription;
  createdOrderId: string;
  isAuthenticated: boolean;

  constructor(private cartService: CartService, private authService: AuthService ) { }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    this.sum = 0;
    this.cartItems.forEach((item) => { this.sum += (item.price * item.quantity) });
    this.isAuthenticated = this.authService.isAuthenticated();
    this.subscription = this.cartService.cartChanged.subscribe((cartData: OrderItem[]) => {
      this.createdOrderId = null;
      this.cartItems = cartData;
      this.sum = 0;
      this.cartItems.forEach((item) => { this.sum += (item.price * item.quantity) });
    });
    this.authSubscription = this.authService.userChanged.subscribe(user => this.isAuthenticated = (user != null));
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  makeOrder(): void {
    this.cartService.createOrder().subscribe(
      (response: any) => {
        this.clearCart();
        this.createdOrderId = response.name;
      },
      (error) => {
        alert('Не удалось оформить заказ!')
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
