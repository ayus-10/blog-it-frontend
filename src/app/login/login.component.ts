import { Component, inject } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ErrorMessageService } from "../error-message/error-message.service";
import { AuthToken } from "../interfaces/auth-token.interface";

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
  errorMessageService = inject(ErrorMessageService);

  handleLogin(value: User) {
    this.http
      .post<AuthToken>(`${environment.apiUrl}/auth`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error.message;
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        localStorage.setItem("TOKEN", res.token);
        this.authService.currentAuthToken.set({
          email: res.email,
          token: res.token,
        });
        this.errorMessageService.alertText.set(`Logged in as ${res.email}`);
        this.router.navigateByUrl("/");
        setTimeout(() => this.errorMessageService.alertText.set(""), 3000);
      });
  }
}
