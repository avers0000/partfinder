import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { CartComponent } from "./cart/cart.component";
import { HomeComponent } from "./home/home.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { AdminGuard } from "./admin/admin-guard.service";

const appRoutes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'order-not-found', component: ErrorPageComponent, data: { message: 'Заказ не найден' } },
    { path: 'user-not-found', component: ErrorPageComponent, data: { message: 'Пользователь не найден' } },
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
    { path: '', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ],
    providers: [AdminGuard]
})
export class AppRoutingModule {

}