import { NgModule } from "@angular/core";
import { CartComponent } from "./cart.component";
import { CartItemComponent } from "./cart-item/cart-item.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        CartComponent,
        CartItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class CartModule {}