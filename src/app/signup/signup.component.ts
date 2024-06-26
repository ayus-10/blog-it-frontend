import { Component, inject } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { AlertMessageService } from "../alert-message/alert-message.service";
import { AuthFormService } from "../auth-form/auth-form.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form action="signup" (formSubmitted)="handleSignup($event)" />
  `,
})
export class SignupComponent {
  http = inject(HttpClient);
  router = inject(Router);
  alertMessageService = inject(AlertMessageService);
  authFormService = inject(AuthFormService);

  handleSignup(value: User) {
    this.authFormService.loading.set(true);
    this.http
      .post(`${environment.apiUrl}/user`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            if (typeof error.error.message === "string") {
              this.alertMessageService.setErrorMessage(error.error.message);
            } else if (Array.isArray(error.error.message)) {
              this.alertMessageService.setErrorMessage(error.error.message[0]);
            }
          } else if (error.status === 500) {
            this.alertMessageService.setErrorMessage(
              "User already exist with provided email",
            );
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe(() => {
        this.authFormService.loading.set(false);
        this.router.navigateByUrl("/login");
        this.alertMessageService.setSuccessMessage("Signed up successfully");
      });
    if (this.authFormService.loading()) {
      setTimeout(() => this.authFormService.loading.set(false), 3000);
    }
  }
}
