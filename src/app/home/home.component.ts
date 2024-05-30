import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Blog } from "../interfaces/blog.interface";
import { BlogItemComponent } from "../blog-item/blog-item.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [BlogItemComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  http = inject(HttpClient);

  fetchedBlogs!: Blog[];

  ngOnInit(): void {
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
