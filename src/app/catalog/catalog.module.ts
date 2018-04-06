import { NgModule } from "@angular/core";

import { CatalogComponent } from "./catalog.component";
import { ProductComponent } from "./product/product.component";
import { ProductListItemExtendedComponent } from "./product-list/product-list-item-extended/product-list-item-extended.component";
import { ProductListItemComponent } from "./product-list/product-list-item/product-list-item.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { CatalogRoutingModule } from "./catalog-routing.module";

@NgModule({
    declarations: [
        CatalogComponent,
        SearchResultsComponent,
        ProductListComponent,
        ProductListItemComponent,
        ProductListItemExtendedComponent,
        ProductComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        CatalogRoutingModule
    ]
})
export class CatalogModule {}