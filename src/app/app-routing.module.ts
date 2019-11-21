import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { ProtectedComponent } from "./protected/protected.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "auth", component: AuthComponent },
  { path: "protected", component: ProtectedComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
