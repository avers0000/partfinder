import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
// import 'rxjs/add/operator/first';


import { Order } from "../shared/order.model";
import { AuthService } from "../auth/auth.service";
import { User } from "../shared/user.model";
import { Subject } from "rxjs/Rx";

@Injectable()
export class OrderResolver implements Resolve<Order> {
    
    constructor(private authService: AuthService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> | Promise<Order> | Order {
        const orderId = route.paramMap.get('id');
        return this.getOrder(orderId);
        // if (this.authService.isAuthenticated()) {
        //     return this.getOrder(orderId);
        // }

        // return this.authService.userChanged.asObservable()
        //     .first().flatMap((user) => { 
        //         return this.getOrder(orderId);
        //     });
    }

    getOrder(id): Observable<Order> {
        return this.authService.getOrder(id)
            .map((order: Order) => {
                if (!order) {
                    this.router.navigate(['/','order-not-found']);
                    return null;
                }
                return order;
            });
    }
}