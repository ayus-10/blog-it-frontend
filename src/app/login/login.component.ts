import { Component, inject } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AlertMessageService } from "../alert-message/alert-message.service";
import { AuthToken } from "../interfaces/auth-token.interface";
import { AuthFormService } from "../auth-form/auth-form.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form action="login" (formSubmitted)="handleLogin($event)" />
  `,
})
export class LoginComponent {
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  alertMessageService = inject(AlertMessageService);
  authFormService = inject(AuthFormService);

  handleLogin(value: User) {
    this.authFormService.loading.set(true);
    this.http
      .post<AuthToken>(`${environment.apiUrl}/auth`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertMessageService.setErrorMessage(error.error.message);
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        localStorage.setItem("TOKEN", res.token);
        this.authService.currentAuthToken.set({
          email: res.email,
          token: res.token,
        });
        this.router.navigateByUrl("/home");
        this.alertMessageService.setSuccessMessage(`Logged in as ${res.email}`);
      });
    this.authFormService.loading.set(false);
  }
}
