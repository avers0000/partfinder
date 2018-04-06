import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }  from '@angular/common/http';
// import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninComponent } from './auth/signin/signin.component';
import { SharedModule } from './shared/shared.module';
import { WildcardModule } from './shared/wildcard.module';
import { AuthUserModule } from './user/auth-user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CatalogModule } from './catalog/catalog.module';
import { CoreModule } from './core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-universal-app'}),
    FormsModule,
    HttpClientModule,
    CatalogModule,
    CartModule,
    AuthModule,
    AuthUserModule,
    SharedModule,
    AppRoutingModule,
    WildcardModule,
    CoreModule
    //NgbModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
