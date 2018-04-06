import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Order, OrderStatusAlias, OrderStatus } from '../../../shared/order.model';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit, OnChanges {
  @Input() orders: Order[];
  @Input() view: string;
  totalSum: number = 0;
  orderStatusAlias: string[] = OrderStatusAlias;
  ordersView: Order[]=[];

  constructor() { }

  ngOnInit() {
    console.log('orders init');
    // this.totalSum=0;
    // this.orders.map((order) => {
    //   this.totalSum += order.totalCost;
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    console.log(changes['view']);

    const view = (changes['view']) ? changes['view'].currentValue : this.view;
      if (view === 'current') {
        this.ordersView = this.orders.filter((order) => order.status < 3 );
      }
      else {
        this.ordersView = this.orders;
      }
  }

  getTotalSum() {
    let total: number = 0;
    this.ordersView.map((order) => {
      total += order.totalCost;
    });
    return total;
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
