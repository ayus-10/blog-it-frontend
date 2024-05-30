import { Component, Input } from "@angular/core";
import { Blog } from "../interfaces/blog.interface";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-blog-item",
  standalone: true,
  imports: [],
  templateUrl: "./blog-item.component.html",
})
export class BlogItemComponent {
  @Input() blogContent!: Blog;

  baseUrl = environment.apiUrl;
}
