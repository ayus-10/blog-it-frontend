import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("TOKEN") || "";

  req = req.clone({
    setHeaders: {
      authorization: `Token ${token}`,
    },
  });

  return next(req);
};
