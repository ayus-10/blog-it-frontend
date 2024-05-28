import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { User } from "../interfaces/user.interface";

@Component({
  selector: "app-auth-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./auth-form.component.html",
})
export class AuthFormComponent {
  @Input() action!: "login" | "signup";

  authForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });

  @Output() formSubmitted = new EventEmitter<User>();

  handleFormSubmit() {
    this.formSubmitted.emit(this.authForm.value as User);
  }
}
