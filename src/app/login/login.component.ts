import { Component } from "@angular/core";
import { AuthFormComponent } from "../auth-form/auth-form.component";
import { User } from "../interfaces/user.interface";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form action="login" (formSubmitted)="handleLogin($event)" />
  `,
})
export class LoginComponent {
  handleLogin(value: User) {
    console.log(value);
  }
}
