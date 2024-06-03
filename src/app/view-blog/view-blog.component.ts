import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Blog } from "../interfaces/blog.interface";
import { catchError, throwError } from "rxjs";
import { Title } from "@angular/platform-browser";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  featherEye,
  featherMessageCircle,
  featherHeart,
} from "@ng-icons/feather-icons";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/auth.service";
import { AlertMessageService } from "../alert-message/alert-message.service";

@Component({
  selector: "app-view-blog",
  standalone: true,
  imports: [NgIconComponent, CommonModule],
  templateUrl: "./view-blog.component.html",
  viewProviders: [
    provideIcons({ featherEye, featherMessageCircle, featherHeart }),
  ],
})
export class ViewBlogComponent implements OnInit {
  @Input() id!: string;

  title = inject(Title);
  http = inject(HttpClient);
  authService = inject(AuthService);
  alertMessageService = inject(AlertMessageService);

  currentBlog = signal<Blog | undefined>(undefined);

  imageUrl = computed(() => {
    return `${environment.apiUrl}/${this.currentBlog()?.imageFile}`;
  });

  liked = signal(false);

  onLikeButtonClick() {
    const liked = this.updateLikes();
    if (liked) {
      this.liked.set(true);
    }
  }

  updateLikes() {
    let result = false;
    this.http
      .get<Blog | null>(`${environment.apiUrl}/blog/likes/${this.id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.alertMessageService.setErrorMessage(
              "You must be logged in to like the blog",
            );
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => {
        if (res) {
          result = true;
        }
      });
    return result;
  }

  updateViews() {
    if (!localStorage.getItem("VIEWED_BLOGS")) {
      localStorage.setItem("VIEWED_BLOGS", JSON.stringify([]));
    }

    const viewedBlogsString = localStorage.getItem("VIEWED_BLOGS") as string;
    const viewedBlogs: string[] = JSON.parse(viewedBlogsString);

    const currentBlogId = this.id;
    if (!viewedBlogs.includes(currentBlogId)) {
      viewedBlogs.push(currentBlogId);
      localStorage.setItem("VIEWED_BLOGS", JSON.stringify(viewedBlogs));
    } else {
      return;
    }

    this.http
      .get(`${environment.apiUrl}/blog/views/${this.id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe();
  }

  get currentUserEmail() {
    return this.authService.currentAuthToken()?.email;
  }

  ngOnInit(): void {
    this.http
      .get<Blog>(`${environment.apiUrl}/blog/${this.id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe((res) => {
        this.currentBlog.set(res);
        this.title.setTitle(`${res.title} - BlogIt`);
        if (
          this.currentUserEmail &&
          res.likes.includes(this.currentUserEmail)
        ) {
          this.liked.set(true);
        }
      });

    this.updateViews();
  }
}
