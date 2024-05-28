import { Component, inject } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { AlertMessageService } from "../alert-message/alert-message.service";

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

  handleSignup(value: User) {
    this.http
      .post(`${environment.apiUrl}/user`, value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            if (typeof error.error.message === "string") {
              this.alertMessageService.setAlertMessage(
                error.error.message,
                "error",
              );
            } else if (Array.isArray(error.error.message)) {
              this.alertMessageService.setAlertMessage(
                error.error.message[0],
                "error",
              );
            }
          } else if (error.status === 500) {
            this.alertMessageService.setAlertMessage(
              "User already exist with provided email",
              "error",
            );
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl("/login");
        this.alertMessageService.setAlertMessage(
          "Signed up successfully",
          "success",
        );
      });
  }
}
