import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { User } from "../interfaces/user.interface";
import { AuthFormService } from "./auth-form.service";

@Component({
  selector: "app-auth-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./auth-form.component.html",
})
export class AuthFormComponent {
  @Input() action!: "login" | "signup";

  @Output() formSubmitted = new EventEmitter<User>();

  authFormService = inject(AuthFormService);

  get isLoading() {
    return this.authFormService.loading();
  }

  authForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });

  handleFormSubmit() {
    this.formSubmitted.emit(this.authForm.value as User);
  }
}
