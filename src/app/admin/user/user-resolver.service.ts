import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';

import { User } from "../../shared/user.model";
import { UserService } from "../user.service";

@Injectable()
export class UserResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
        return this.userService.getUserAsync(route.paramMap.get('id'))
            .map((user: User) => {
                if (!user) {
                    this.router.navigate(['/','user-not-found']);
                    return null;
                };
                return user;
            });
    }
}