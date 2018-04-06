import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";

import { User, UserStatus, UserType } from '../shared/user.model';
import { UserProfile } from '../shared/user-profile.model';
import { Order, OrderStatus } from '../shared/order.model';
import { OrderItem } from '../shared/order-item.model';

@Injectable()
export class UserService {

  private url: string = 'https://partfinder-8bf92.firebaseio.com/';

  constructor(private http: HttpClient) { }

  GetUsersAsync(): Observable<User[]> {
    return this.http.get(`${this.url}users.json`)
      .map((body) => {
        let users: User[] = [];
        for (const key in body) {
          if (body.hasOwnProperty(key)) {
              const element = body[key];
              users.push(this.mapUser(element));
          }
        }
        return users;
      })
      .catch((error) => {
        return Observable.of([])
      });
  }

  getUserAsync(userId: string): Observable<any> {
    return this.http.get(`${this.url}users/${userId}.json`)
    .map((item) => {
        return this.mapUser(item);
    })
    .catch((error) => { return Observable.of(null)});
  }

  getUserOrdersAsync(userId: string): Observable<Order[]> {
    return this.http.get(`${this.url}users/${userId}/orders.json`)
    .map((data) => {
        let orders: Order[] = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                orders.push(this.mapOrder(key, element));
            }
        }
        return orders;
    })
    .catch((error) => {
        // let pageable = new Pageable<Product>();
        // pageable.total = 0;
        // pageable.data = []
        return Observable.of([]);
    });
  }

  getOrdersAsync(): Observable<Order[]> {
    return this.http.get(`${this.url}users.json`)
      .map((body) => {
        let orders: Order[] = [];

        for (const key in body) {
          if (body.hasOwnProperty(key)) {
            const element = body[key];
            const ordersElement = element['orders'];
            if (ordersElement) {
              let user = this.mapUser(element);
              for (const key in ordersElement) {
                if (ordersElement.hasOwnProperty(key)) {
                  let order = this.mapOrder(key, ordersElement[key])
                  order.user = user;
                  orders.push(order);
                }
              }
            }
          }
        }
        return orders;
      })
      .catch((error) => {
        return Observable.of([])
      });
  }

  getOrderAsync(userId: string, orderId: string): Observable<Order> {
    if (!userId || !orderId) return Observable.of(null);
    return this.http.get(`${this.url}users/${userId}.json`)
        .map((body) => {
          const orders = body['orders'];
          let order: Order = null;
          if (orders && orders[orderId]) {
            order = this.mapOrder(orderId, orders[orderId]);
            order.user = this.mapUser(body);
          }            
          return order;            
        })
        .catch((error) => {
            return Observable.of(null);
        });
  }

  updateUserStatus(userId: string, status: UserStatus): Observable<any> {
    return this.http.patch(`${this.url}users/${userId}.json`, { status: status });
  }

  updateUserType(userId: string, type: UserType): Observable<any> {
    return this.http.patch(`${this.url}users/${userId}.json`, { type: type });
  }

  updateOrdersStatus(userId: string, orderId: string, status: OrderStatus) {
    return this.http.patch(`${this.url}users/${userId}/orders/${orderId}.json`, { status: status });
  }

  private mapUser(data: any): User {
    let user: User = new User(data.userId, data.email);
    user.status = data.status;
    user.type = data.type;
    user.roles = data.roles || [];

    let profile: UserProfile = new UserProfile();
    if (data.profile) {
        profile.email2 = data.profile.email2 || '';
        profile.firstName = data.profile.firstName || '';
        profile.lastName = data.profile.lastName || '';
        profile.address = data.profile.address || '';
        profile.phones = data.profile.phones || [];
    }
    user.profile = profile;
    return user;
  }

  private mapOrder(key: any, data: any): Order {
    let order = new Order();
    let items: OrderItem[] = [];
    let sum = 0;
    for (const item of data.items) {
        items.push(new OrderItem(item.productId, item.name, item.price, item.quantity));
        if (item.price && item.quantity) sum += (item.price * item.quantity);
    }

    order.id = key;
    order.createdDate = data.createdDate;
    order.status = (data.status) ? data.status : OrderStatus.Pending;
    order.items = items;
    order.totalCost = sum;
    return order;
  }

}
