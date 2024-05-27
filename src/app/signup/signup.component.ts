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
    <app-auth-form
      action="signup"
      (formSubmitted)="handleSignup($event)"
      [errorText]="errorMessage"
    />
  `,
})
export class SignupComponent {
  errorMessage!: string;

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
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = error.error.message[0];
            }
          } else if (error.status === 500) {
            this.errorMessage = "User already exist with provided email";
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe(() => {
        this.alertMessageService.alertMessage.set({
          text: "Signed up successfully",
          type: "success",
        });
        this.router.navigateByUrl("/login");
        setTimeout(
          () => this.alertMessageService.alertMessage.set(undefined),
          3000,
        );
      });
  }
}
