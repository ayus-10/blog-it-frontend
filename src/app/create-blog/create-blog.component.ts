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
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

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

  http = inject(HttpClient);

  alertMessageService = inject(AlertMessageService);

  blogForm!: FormGroup;

  selectedImage!: File | null;

  onImageSelect(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    this.selectedImage = eventTarget.files ? eventTarget.files[0] : null;
  }

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
      this.alertMessageService.setAlertMessage(
        "Title must be at least 20 characters long",
        "error",
      );
    } else if (category.errors) {
      this.alertMessageService.setAlertMessage(
        "Selected category is invalid",
        "error",
      );
    } else if (content.errors) {
      this.alertMessageService.setAlertMessage(
        "Content must contain at least 100 characters",
        "error",
      );
    }
    return true;
  }

  onSubmit() {
    if (this.validationErrors()) {
      return;
    }

    const { title, category, content } = this.blogForm.value;

    const blogData = new FormData();

    blogData.append("title", title as string);
    blogData.append("category", category as string);
    blogData.append("content", content as string);

    if (this.selectedImage) {
      blogData.append("image", this.selectedImage);
    }

    this.http
      .post(`${environment.apiUrl}/blog`, blogData)
      .subscribe((res) => console.log(res));
  }
}
