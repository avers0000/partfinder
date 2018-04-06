import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersComponent } from "./users/users.component";
import { OrdersComponent } from "./orders/orders.component";
import { AdminComponent } from "./admin.component";
// import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { UserComponent } from "./user/user.component";
import { UserProfileComponent } from "./user/user-profile/user-profile.component";
import { UserOrderComponent } from "./user/user-order/user-order.component";
import { UserOrdersComponent } from "./user/user-orders/user-orders.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { AdminGuard } from "./admin-guard.service";
import { UserResolver } from "./user/user-resolver.service";
import { UserOrderResolver } from "./user/user-order-resolver.service";
import { UserService } from "./user.service";

@NgModule({
    declarations: [
        AdminComponent,
        // AdminHomeComponent,
        UsersComponent,
        OrdersComponent,
        UserComponent,
        UserProfileComponent,
        UserOrdersComponent,
        UserOrderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        SharedModule
    ],
    providers: [
        // AdminGuard,
        UserResolver,
        UserOrderResolver,
        UserService
    ]
})
export class AdminModule {}