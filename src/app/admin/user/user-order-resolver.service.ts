import { Injectable } from "@angular/core";
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from 'rxjs/Observable';

import { Order } from "../../shared/order.model";
import { UserService } from "../user.service";

@Injectable()
export class UserOrderResolver implements Resolve<Order> {

    constructor(private userService: UserService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> | Promise<Order> | Order {
        const userId = route.paramMap.get('id');
        const orderId = route.paramMap.get('orderId');

        return this.userService.getOrderAsync(userId, orderId).map((order: Order) => {
            if (!order) {
                this.router.navigate(['/','order-not-found']);
                return null;
            }
            return order;
        });
    }
}