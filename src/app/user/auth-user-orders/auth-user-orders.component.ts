import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { Order, OrderStatus, OrderStatusAlias } from '../../shared/order.model';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-auth-user-orders',
  templateUrl: './auth-user-orders.component.html',
  styleUrls: ['./auth-user-orders.component.css']
})
export class AuthUserOrdersComponent implements OnInit, OnDestroy {
  header: string = 'Заказы';
  currentView: boolean = true;
  orders: Order[] = [];
  ordersView: Order[] = [];
  totalSum: number = 0;
  orderStatusAlias: string[] = OrderStatusAlias;

  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getOrders();
    this.authSubscription = this.authService.userChanged.subscribe((user: User) => {
      if (user) {
        this.getOrders()
      }
      else {
        this.router.navigate(['/']);
      }
    });
  }

  getOrders() {
    this.authService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.setOrderView();
      }
    );
  }

  toggleView() {
    this.currentView = !this.currentView;
    this.setOrderView();
  }

  getStatusCss(status) {
    return {
      'badge-warning': status == OrderStatus.Pending,
      'badge-info': status == OrderStatus.Accepted,
      'badge-primary': status == OrderStatus.InProgress,
      'badge-success': status == OrderStatus.Implemented,
      'badge-secondary': status == OrderStatus.Canceled
    };
  }

  setOrderView() {
    if (this.currentView) {
      this.ordersView = this.orders.filter((order) => order.status < 3 );
    }
    else {
      this.ordersView = this.orders;
    }
    this.totalSum=0;
    this.ordersView.map((order) => {
      this.totalSum += order.totalCost;
    });
  }
 
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
