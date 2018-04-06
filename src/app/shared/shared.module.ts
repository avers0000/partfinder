import { NgModule } from "@angular/core";

import { CollapseDirective } from "./collapse.directive";
import { DropdownDirective } from "./dropdown.directive";
import { DropdownToggleDirective } from "./dropdown-toggle.directive";
import { DropdownMenuDirective } from "./dropdown-menu.directive";
import { DropdownCloseElementDirective } from "./dropdown-close-element.directive";
import { EnumAliasPipe } from "./enum-alias.pipe";
import { ShortenPipe } from "./shorten.pipe";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "../order/order.component";
// import { SigninComponent } from "../auth/signin/signin.component";
import { FormsModule } from "@angular/forms";
import { NextLevelMenuComponent } from "../catalog/next-level-menu/next-level-menu.component";

@NgModule({
    declarations: [
        CollapseDirective,
        DropdownDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownCloseElementDirective,
        EnumAliasPipe,
        ShortenPipe,
        OrderComponent,
        NextLevelMenuComponent
        // SigninComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        CollapseDirective,
        DropdownDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownCloseElementDirective,
        EnumAliasPipe,
        ShortenPipe,
        OrderComponent,
        NextLevelMenuComponent
        // SigninComponent
    ]
})
export class SharedModule {}