import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Data, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User, UserTypeAlias, UserStatusAlias } from '../../shared/user.model';
import { Order } from '../../shared/order.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;
  view: string;
  orders: Order[] = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    const view = this.route.snapshot.queryParamMap.get('view');
    this.view = view || 'profile';
    if (view) this.view = view;

    this.route.data.subscribe((data: Data) => {
      this.user = data['user'];
      this.getUserOrders();
    });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const view = this.route.snapshot.queryParamMap.get('view');
      if (view) this.view = view;
    });
  }

  // getUser(userId: string): void {
  //   this.userService.getUserAsync(userId).subscribe((user: User) => {
  //     this.user = user;
  //   });
  // }

  getUserOrders() {
    this.userService.getUserOrdersAsync(this.user.userId).subscribe((orders: Order[]) => {
      this.orders = (!orders) ? [] : orders;
    });
  }

  switchView(view: string) {
    if (this.view !== view) this.router.navigate([], { relativeTo: this.route,  queryParams: { view: view }} );
  }

  // getOrdersView(view: string): Order[] {
  //   if (view === 'current') {
  //     return this.orders.filter((order) => order.status < 3 );
  //   }
  //   else {
  //     return this.orders;
  //   }
  // }

}
