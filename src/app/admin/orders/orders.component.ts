import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Order, OrderStatusAlias, OrderStatus } from '../../shared/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  orderStatusAlias: string[] = OrderStatusAlias;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('init orders');
    this.userService.getOrdersAsync().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
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


}
