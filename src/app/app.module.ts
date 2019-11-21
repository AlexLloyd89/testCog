import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NavComponent } from "./nav/nav.component";
import { AuthComponent } from "./auth/auth.component";
import { ProtectedComponent } from "./protected/protected.component";

@NgModule({
  declarations: [AppComponent, NavComponent, AuthComponent, ProtectedComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
