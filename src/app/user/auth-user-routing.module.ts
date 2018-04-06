import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../shared/auth-guard.service";
import { ProfileComponent } from "./profile/profile.component";
import { AuthUserOrdersComponent } from "./auth-user-orders/auth-user-orders.component";
import { AuthUserOrderComponent } from "./auth-user-order/auth-user-order.component";
import { SettingsComponent } from "./settings/settings.component";
import { CanDeactivateGuard } from "../shared/can-deactivate-guard.service";
import { OrderResolver } from "../order/order-resolver.service";

const authUserRoutes: Routes = [
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'user-orders', canActivate: [AuthGuard], component: AuthUserOrdersComponent },
    { path: 'user-orders/:id', canActivate: [AuthGuard], component: AuthUserOrderComponent, resolve: { order: OrderResolver } },
    { path: 'settings', canActivate: [AuthGuard], component: SettingsComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(authUserRoutes)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AuthUserRoutingModule {}