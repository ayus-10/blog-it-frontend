import { Component, Input } from "@angular/core";
import { Blog } from "../interfaces/blog.interface";
import { environment } from "../../environments/environment";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  featherEye,
  featherHeart,
  featherMessageCircle,
} from "@ng-icons/feather-icons";

@Component({
  selector: "app-blog-item",
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: "./blog-item.component.html",
  viewProviders: [
    provideIcons({ featherEye, featherMessageCircle, featherHeart }),
  ],
})
export class BlogItemComponent {
  @Input() blogContent!: Blog;

  baseUrl = environment.apiUrl;
}
