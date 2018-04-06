import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { ProfileComponent } from "./profile/profile.component";
import { AuthUserOrdersComponent } from "./auth-user-orders/auth-user-orders.component";
import { SettingsComponent } from "./settings/settings.component";
import { AuthUserOrderComponent } from "./auth-user-order/auth-user-order.component";
import { AuthUserRoutingModule } from "./auth-user-routing.module";
import { SharedModule } from "../shared/shared.module";
import { OrderResolver } from "../order/order-resolver.service";
import { CanDeactivateGuard } from "../shared/can-deactivate-guard.service";

@NgModule({
    declarations: [
        ProfileComponent,
        AuthUserOrdersComponent,
        SettingsComponent,
        AuthUserOrderComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthUserRoutingModule,
        SharedModule
    ],
    providers: [
        OrderResolver,
        CanDeactivateGuard
    ]
})
export class AuthUserModule {}