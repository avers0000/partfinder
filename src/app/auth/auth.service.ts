import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import * as firebase from 'firebase';

import { User, UserType, UserStatus } from '../shared/user.model';
import { BehaviorSubject, Subject } from 'rxjs/Rx';
import { UserProfile } from "../shared/user-profile.model";
import { Order, OrderStatus } from "../shared/order.model";
import { OrderItem } from "../shared/order-item.model";

@Injectable()
export class AuthService {
    user: User;
    userChanged: Subject<User> = new Subject<User>();

    constructor(private http: HttpClient) {}

    startAuthCheck() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.GetUserAsync(user.uid).toPromise()
                    .then((user: User) => {
                        this.user = user;
                        if (user) {
                            this.getToken();                            
                        }
                        else {
                            this.userChanged.next(null);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            else {
                this.userChanged.next(null);
            }
        });
    }

    signupUser(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((response: firebase.User) => {
                const newUser = this.CreateNewUser(response.uid, response.email);
                return this.SaveNewUser(newUser).toPromise();
            });
    }

    signinUser(email: string, password: string) {
        this.logout();
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then((response: firebase.User) => {
                return this.GetUserAsync(response.uid).toPromise();
            });
    }

    logout() {
        firebase.auth().signOut().catch(error => console.log(error));
        this.user = null;
        this.userChanged.next(null);
    }

    isAuthenticated(): boolean {
        return this.user != null;
    }

    updateProfile(profile: UserProfile): Observable<any> {
        if (!(this.user && this.user.userId)) throw "Вы не авторизованы";
        return this.http.put(`https://partfinder-8bf92.firebaseio.com/users/${this.user.userId}/profile.json`, profile)
            .map((response) => {
                this.user.profile = profile;
                return Observable.of(true);
            });
    }

    getOrders(): Observable<Order[]> {
        if (!this.user || !this.user.userId) return Observable.of([]);
        return this.http.get(`https://partfinder-8bf92.firebaseio.com/users/${this.user.userId}/orders.json`)
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

    getOrder(id: string): Observable<Order> {
        if (!this.user || !this.user.userId) return Observable.of(null);
        return this.http.get(`https://partfinder-8bf92.firebaseio.com/users/${this.user.userId}/orders/${id}.json`)
            .map((response) => {
                let order: Order = this.mapOrder(id, response);
                order.user = this.user;
                return order;            
            })
            .catch((error) => {
                return Observable.of(null);
            });
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
 
    private getToken() {
        firebase.auth().currentUser.getToken().then(
            (token: string) => {
                this.user.token = token;
                this.userChanged.next(this.user);
            }
        );
    }

    private GetUserAsync(userId: string): Observable<User> {
        return this.http.get(`https://partfinder-8bf92.firebaseio.com/users/${userId}.json`)
            //.map((response) => response.json())
            .map((body) => {
                if (body) { 
                    return this.mapUser(body);
                }
                else {
                    return null;
                }
            })

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

    private CreateNewUser(userId: string, email: string) {
        let user: User = new User(userId, email);
        user.status = UserStatus.Active;
        user.type = UserType.User;
        user.roles =[];
        user.profile = new UserProfile();
        return user;
    }

    private SaveNewUser(user: User): Observable<any> {
        return this.http.put(`https://partfinder-8bf92.firebaseio.com/users/${user.userId}.json`, user);
    }
}