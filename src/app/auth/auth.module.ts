import { NgModule } from "@angular/core";

// import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        SignupComponent
        // SigninComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        // AuthRoutingModule,
        SharedModule
    ]
})
export class AuthModule {}