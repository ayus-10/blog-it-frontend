import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateBlogComponent } from "./create-blog/create-blog.component";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";
import { ViewBlogComponent } from "./view-blog/view-blog.component";
import { NotFoundComponent } from "./not-found/not-found.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
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
  {
    path: "view/:id",
    component: ViewBlogComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
