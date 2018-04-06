import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { Order, OrderStatusAlias, OrderStatus, OrderStatusTransitions } from '../shared/order.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { UserType } from '../shared/user.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @Input() order: Order;
  @Input() editable: boolean;
  @Output() onStatusChange = new EventEmitter<OrderStatus>();
  header: string;
  orderStatusAlias: string[] = OrderStatusAlias;
  availableStatuses: OrderStatus[] = [];
  private authSubscription: Subscription;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.order = data["order"];
      this.header = `Заказ № ${this.order.id}`;
      if (this.editable) this.availableStatuses = OrderStatusTransitions[this.order.status];
    })

    // this.authSubscription = this.authService.userChanged.subscribe((user) => {
    //   this.router.navigate(['/']);
    // });
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

  navigateBack() {
    const back = this.route.snapshot.queryParamMap.get('back');
    if (back) {
      if (back === 'user') {
        const view = this.route.snapshot.queryParamMap.get('view');
        if (view) {
          this.router.navigate(["../"], { queryParams: { view: view }, relativeTo: this.route});
        }
        else {
          this.router.navigate(["../"], {relativeTo: this.route});
        }
      }
      else {
        this.router.navigate(["/admin/orders"]);
      }
    } else {
      this.router.navigate(["../"], {relativeTo: this.route});
    }
  }

  navigateUser() {
    if (this.authService.user.type === UserType.Admin && this.authService.user.userId !== this.order.user.userId) {
      this.router.navigate(['/admin/users', this.order.user.userId ]);
    }
    else {
      this.router.navigate(['/profile']);
    }
  }

  changeStatus(status: OrderStatus) {
    this.onStatusChange.emit(status);
  }
}
