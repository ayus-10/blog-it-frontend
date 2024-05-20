import { Component, inject } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.development";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form
      action="login"
      (formSubmitted)="handleLogin($event)"
      [errorText]="errorMessage"
    />
  `,
})
export class LoginComponent {
  errorMessage!: string;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  handleLogin(value: User) {
    this.http
      .post(`${environment.apiUrl}/auth`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          return throwError(() => new Error(error.statusText));
        })
      )
      .subscribe((res: any) => {
        localStorage.setItem("TOKEN", res.token);
        this.authService.currentAuthToken.set({ token: res.token });
        this.router.navigateByUrl("/");
      });
  }
}
