import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { UsersComponent } from "./users/users.component";
import { UserComponent } from "./user/user.component";
import { UserOrderComponent } from "./user/user-order/user-order.component";
import { OrdersComponent } from "./orders/orders.component";
import { AdminGuard } from "./admin-guard.service";
import { UserResolver } from "./user/user-resolver.service";
import { UserOrderResolver } from "./user/user-order-resolver.service";

const adminRoutes: Routes = [
    { path: '', canActivate: [AdminGuard], component: AdminComponent, children: [
        { path: '', redirectTo: "/", pathMatch: "full" },        
        { path: 'users', component: UsersComponent },
        { path: 'users/:id', component: UserComponent, resolve: { user: UserResolver } },
        { path: 'users/:id/:orderId', component: UserOrderComponent, resolve: { order: UserOrderResolver } },
        { path: 'orders', component: OrdersComponent }
        // { path: 'user-not-found', component: ErrorPageComponent, data: { message: 'Пользователь не найден' } }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}