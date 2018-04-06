import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CatalogComponent } from "./catalog.component";

const catalogRoutes: Routes = [
    { path: 'catalog', component: CatalogComponent },
    { path: 'catalog/category/:category', component: CatalogComponent },
    { path: 'catalog/category/:category/:group', component: CatalogComponent },
    { path: 'catalog/category/:category/:group/:manufacturer', component: CatalogComponent },
    { path: 'catalog/:manufacturer', component: CatalogComponent },
    { path: 'catalog/:manufacturer/:model', component: CatalogComponent },
    { path: 'catalog/:manufacturer/:model/:category', component: CatalogComponent },
    { path: 'catalog/:manufacturer/:model/:category/:group', component: CatalogComponent },
    { path: 'catalog/:manufacturer/:model/:category/:group/:productId', component: CatalogComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(catalogRoutes)
    ],
    exports: [RouterModule]
})
export class CatalogRoutingModule {}