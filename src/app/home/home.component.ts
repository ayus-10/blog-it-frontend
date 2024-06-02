import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Blog } from "../interfaces/blog.interface";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  featherChevronDown,
  featherFilter,
  featherSearch,
} from "@ng-icons/feather-icons";
import { BlogCategory, blogCategories } from "../data/blog-categories";
import { SortOption, sortOptions } from "../data/sort-options";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [BlogItemComponent, NgIconComponent],
  templateUrl: "./home.component.html",
  viewProviders: [
    provideIcons({ featherSearch, featherFilter, featherChevronDown }),
  ],
})
export class HomeComponent implements OnInit {
  blogCategories = blogCategories;
  sortOptions = sortOptions;

  searchInput = signal<string>("");
  selectedCategory = signal<BlogCategory>("All");
  selectedSort = signal<SortOption>("Views");

  onSearchChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    const search = eventTarget.value;
    this.searchInput.set(search);
  }

  onCategoryChange(event: Event) {
    const eventTarget = event.target as HTMLSelectElement;
    const category = eventTarget.value;
    this.selectedCategory.set(category as BlogCategory);
  }

  onSortChange(event: Event) {
    const eventTarget = event.target as HTMLSelectElement;
    const sort = eventTarget.value;
    this.selectedSort.set(sort as SortOption);
  }

  fetchedBlogs = signal<Blog[]>([]);

  numberOfBlogs = signal(5);

  onShowMoreClick() {
    this.numberOfBlogs.update((prev) => prev + 5);
  }

  blogs = computed(() => {
    const fetchedBlogs = this.fetchedBlogs();
    const categorizedBlogs = this.categorizeBlogs(fetchedBlogs);
    const searchedBlogs = this.searchBlogs(categorizedBlogs);
    const sortedBlogs = this.sortBlogs(searchedBlogs);
    const slicedBlogs = sortedBlogs.slice(0, this.numberOfBlogs());
    return slicedBlogs;
  });

  searchBlogs(blogs: Blog[]) {
    let filteredBlogs: Blog[] = blogs;
    const search = this.searchInput();
    if (search) {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return filteredBlogs;
  }

  categorizeBlogs(blogs: Blog[]) {
    let filteredBlogs: Blog[] = blogs;
    if (this.selectedCategory() !== "All") {
      filteredBlogs = blogs.filter(
        (blog) => blog.category === this.selectedCategory(),
      );
    }
    return filteredBlogs;
  }

  sortBlogs(blogs: Blog[]) {
    switch (this.selectedSort()) {
      case "Views":
        sort("views");
        break;
      case "Likes":
        sort("likes");
        break;
      case "Comments":
        sort("comments");
    }

    function sort(prop: "views" | "likes" | "comments") {
      blogs.sort((a, b) => {
        if (a[prop] < b[prop]) {
          return 1;
        } else if (a[prop] > b[prop]) {
          return -1;
        }
        return 0;
      });
    }
    return blogs;
  }

  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<Blog[]>(`${environment.apiUrl}/blog`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        this.fetchedBlogs.set(res);
      });
  }
}
