import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isAuthenticated()) return true;

        return this.authService.userChanged.asObservable().first().map((user) => {
            if (user) {
                return true;
            }
            else {
                this.router.navigate(['/']);
                return false;
            }
        });
    }
}