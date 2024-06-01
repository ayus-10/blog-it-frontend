import { Component, OnInit, inject } from "@angular/core";
import { blogCategories } from "../data/blog-categories";
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
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-blog",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./create-blog.component.html",
})
export class CreateBlogComponent implements OnInit {
  blogCategories = blogCategories;

  http = inject(HttpClient);
  router = inject(Router);
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
      this.alertMessageService.setErrorMessage(
        "Title must contain at least 20 characters",
      );
    } else if (category.errors) {
      this.alertMessageService.setErrorMessage("Selected category is invalid");
    } else if (content.errors) {
      this.alertMessageService.setErrorMessage(
        "Content must contain at least 100 characters",
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
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            if (typeof error.error.message === "string") {
              this.alertMessageService.setErrorMessage(error.error.message);
            } else if (Array.isArray(error.error.message)) {
              this.alertMessageService.setErrorMessage(error.error.message[0]);
            }
          } else if (error.status === 406) {
            this.alertMessageService.setErrorMessage(error.error.error);
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe(() => {
        this.router.navigateByUrl("/home");
        this.alertMessageService.setSuccessMessage("Created blog successfully");
      });
  }
}
