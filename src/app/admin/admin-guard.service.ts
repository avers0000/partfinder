import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanLoad, Route } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { AuthService } from "../auth/auth.service";
import { UserType } from "../shared/user.model";
import { resource } from "selenium-webdriver/http";

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.user && this.authService.user.type === UserType.Admin) return true;

        let timeout = Observable.timer(1000).map(() => {return false});

        return Observable.merge(timeout, this.checkUser()).first().map((result) => {
            if (!result) this.router.navigate(['/']);
            return result;
        });
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.user && this.authService.user.type === UserType.Admin) return true;

        let timeout = Observable.timer(1000).map(() => {return false});

        return Observable.merge(timeout, this.checkUser()).first().map((result) => {
            if (!result) this.router.navigate(['/']);
            return result;
        });
    }

    checkUser(): Observable<boolean>{
        return this.authService.userChanged.asObservable().first().map((user) => {
            if (user && user.type === UserType.Admin) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}