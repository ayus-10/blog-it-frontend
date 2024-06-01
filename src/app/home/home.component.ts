import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Blog } from "../interfaces/blog.interface";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { featherFilter, featherSearch } from "@ng-icons/feather-icons";
import { blogCategories } from "../data/blog-categories";
import { sortCategories } from "../data/sort-categories";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [BlogItemComponent, NgIconComponent],
  templateUrl: "./home.component.html",
  viewProviders: [provideIcons({ featherSearch, featherFilter })],
})
export class HomeComponent implements OnInit {
  blogCategories = blogCategories;
  sortCategories = sortCategories;

  http = inject(HttpClient);

  fetchedBlogs!: Blog[];

  ngOnInit(): void {
    this.blogCategories.unshift("All");

    this.http
      .get<Blog[]>(`${environment.apiUrl}/blog`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        this.fetchedBlogs = res;
      });
  }
}
