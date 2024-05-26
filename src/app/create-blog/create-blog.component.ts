import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-create-blog",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./create-blog.component.html",
})
export class CreateBlogComponent {
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

  blogFormValues = new FormGroup({
    title: new FormControl(""),
    category: new FormControl(""),
    image: new FormControl(""),
    content: new FormControl(""),
  });

  handleSubmit() {
    console.log(this.blogFormValues.value);
  }
}
