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

  handleLogin(value: User) {
    this.http
      .post<AuthToken>(`${environment.apiUrl}/auth`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertMessageService.setAlertMessage(
            error.error.message,
            "error",
          );
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        localStorage.setItem("TOKEN", res.token);
        this.authService.currentAuthToken.set({
          email: res.email,
          token: res.token,
        });
        this.router.navigateByUrl("/");
        this.alertMessageService.setAlertMessage(
          `Logged in as ${res.email}`,
          "success",
        );
      });
  }
}
