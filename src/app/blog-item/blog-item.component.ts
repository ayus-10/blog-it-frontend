import { Component, Input, inject } from "@angular/core";
import { Blog } from "../interfaces/blog.interface";
import { environment } from "../../environments/environment";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  featherEye,
  featherHeart,
  featherMessageCircle,
} from "@ng-icons/feather-icons";
import { Router } from "@angular/router";

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

  router = inject(Router);

  redirect(id: string) {
    this.router.navigateByUrl(`/view/${id}`);
  }
}
