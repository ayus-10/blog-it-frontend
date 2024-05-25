import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateBlogComponent } from "./create-blog/create-blog.component";
import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "signup",
    component: SignupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create",
    component: CreateBlogComponent,
    canActivate: [AuthGuard],
  },
];
