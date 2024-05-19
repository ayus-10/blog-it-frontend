import { Component } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form action="signup" (formSubmitted)="handleSignup($event)" />
  `,
})
export class SignupComponent {
  handleSignup(value: User) {
    console.log(value);
  }
}
