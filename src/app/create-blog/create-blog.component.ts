import { Component, OnInit, inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AlertMessageService } from "../alert-message/alert-message.service";

@Component({
  selector: "app-create-blog",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./create-blog.component.html",
})
export class CreateBlogComponent implements OnInit {
  blogCategories = [
    "Lifestyle",
    "Technology",
    "Health and Fitness",
    "Food and Drink",
    "Fashion and Beauty",
    "Personal Finance",
    "Education",
    "Business and Entrepreneurship",
    "Arts and Crafts",
    "Entertainment",
    "Travel",
    "Gaming",
    "Other",
  ];

  alertMessageService = inject(AlertMessageService);

  blogForm!: FormGroup;

  ngOnInit(): void {
    this.blogForm = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(20),
      ]),
      category: new FormControl("", [
        Validators.required,
        this.validateCategory(),
      ]),
      image: new FormControl(""),
      content: new FormControl("", [
        Validators.required,
        Validators.minLength(100),
      ]),
    });
  }

  validateCategory(): ValidatorFn {
    return (contol: AbstractControl): ValidationErrors | null => {
      const isValid = this.blogCategories.includes(contol.value);
      if (isValid) {
        return null;
      }
      return {
        validSelection: false,
      };
    };
  }

  validationErrors() {
    if (this.blogForm.valid) {
      return false;
    }
    const { title, category, content } = this.blogForm.controls;
    if (title.errors) {
      this.setErrorMessage("Title must be at least 20 characters long");
    } else if (category.errors) {
      this.setErrorMessage("Selected category is invalid");
    } else if (content.errors) {
      this.setErrorMessage("Content must contain at least 100 characters");
    }
    return true;
  }

  setErrorMessage(errorText: string) {
    this.alertMessageService.alertMessage.set({
      text: errorText,
      type: "error",
    });
    setTimeout(() => {
      this.alertMessageService.alertMessage.set(undefined);
    }, 3000);
  }

  onSubmit() {
    if (this.validationErrors()) {
      return;
    }
    console.log(this.blogForm.value);
  }
}
