import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const AuthGuard: CanActivateFn = (route) => {
  const nonProtectedRoutes = ["login", "signup"];

  const currentPath = route.routeConfig?.path;

  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthTokenNull = authService.currentAuthToken() === null;

  if (currentPath && nonProtectedRoutes.includes(currentPath)) {
    if (isAuthTokenNull) {
      return true;
    }
    router.navigateByUrl("/home");
    return false;
  }

  if (isAuthTokenNull) {
    router.navigateByUrl("/login");
    return false;
  }
  return true;
};
