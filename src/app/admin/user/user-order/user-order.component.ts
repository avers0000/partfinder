import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { Order, OrderStatus } from '../../../shared/order.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})
export class UserOrderComponent implements OnInit {
  order: Order;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.order = data["order"];
    });
  };
  
  changeStatus(status: OrderStatus) {
    this.userService.updateOrdersStatus(this.order.user.userId, this.order.id, status).subscribe((response: any) =>
      {
        this.order.status = status;
      },
      (error) => {
        alert('Не удалось изменить статус!');
      }
    );
  }
}
