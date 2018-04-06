import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const wildcardRoutes: Routes = [
    { path: '**', redirectTo: "/" }
]

@NgModule({
    imports: [
        RouterModule.forChild(wildcardRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WildcardRoutingModule {}