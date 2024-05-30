import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateBlogComponent } from "./create-blog/create-blog.component";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    title: "Log in - BlogIt",
  },
  {
    path: "signup",
    component: SignupComponent,
    canActivate: [AuthGuard],
    title: "Sign up - BlogIt",
  },
  {
    path: "create",
    component: CreateBlogComponent,
    canActivate: [AuthGuard],
    title: "Create a blog - BlogIt",
  },
  {
    path: "home",
    component: HomeComponent,
    title: "Home - BlogIt",
  },
];
