import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { NavigatorComponent } from "./catalog/navigator/navigator.component";
import { HomeComponent } from "./home/home.component";
import { SearchFormComponent } from "./catalog/search-form/search-form.component";
import { AboutComponent } from "./about/about.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { SharedModule } from "./shared/shared.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { CatalogService } from "./catalog/catalog.servise";
import { CartService } from "./cart/cart.service";
import { AuthService } from "./auth/auth.service";

@NgModule({
    declarations: [
        HeaderComponent,
        NavigatorComponent,
        HomeComponent,
        SearchFormComponent,
        AboutComponent,
        ContactsComponent,
        SigninComponent,
        ErrorPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        AppRoutingModule
    ],
    exports: [
        AppRoutingModule,
        HeaderComponent,
        NavigatorComponent,
        SearchFormComponent
    ],
    providers: [
        CatalogService, 
        CartService, 
        AuthService
    ]
})
export class CoreModule {}