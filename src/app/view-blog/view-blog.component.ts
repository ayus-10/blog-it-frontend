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
import { Blog, Comment } from "../interfaces/blog.interface";
import { catchError, throwError } from "rxjs";
import { Title } from "@angular/platform-browser";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  featherEye,
  featherMessageCircle,
  featherHeart,
  featherUser,
  featherSend,
  featherTrash2,
} from "@ng-icons/feather-icons";
import { bootstrapHeart, bootstrapHeartFill } from "@ng-icons/bootstrap-icons";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/auth.service";
import { AlertMessageService } from "../alert-message/alert-message.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-blog",
  standalone: true,
  imports: [NgIconComponent, CommonModule, ReactiveFormsModule],
  templateUrl: "./view-blog.component.html",
  viewProviders: [
    provideIcons({
      featherEye,
      featherMessageCircle,
      featherHeart,
      featherUser,
      featherSend,
      featherTrash2,
      bootstrapHeart,
      bootstrapHeartFill,
    }),
  ],
})
export class ViewBlogComponent implements OnInit {
  @Input() id!: string;

  get currentUserEmail() {
    return this.authService.currentAuthToken()?.email;
  }

  isLoading = signal(false);

  router = inject(Router);
  title = inject(Title);
  http = inject(HttpClient);
  authService = inject(AuthService);
  alertMessageService = inject(AlertMessageService);

  currentBlog = signal<Blog | undefined>(undefined);
  blogComments = signal<Comment[] | undefined>(undefined);

  imageUrl = computed(() => {
    return `${environment.imageSrcUrl}/${this.currentBlog()?.imageFile}`;
  });

  liked = signal(false);

  commentInput = new FormControl("");

  updateLikes() {
    this.http
      .get<Blog>(`${environment.apiUrl}/blog/likes/${this.id}`)
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
      .subscribe(() => {
        this.liked.update((prev) => !prev);

        this.currentBlog.update((prev) => {
          if (!prev || !this.currentUserEmail) {
            return prev;
          }
          if (this.liked()) {
            prev.likes.push(this.currentUserEmail);
            return prev;
          }
          const updatedLikes = prev.likes.filter(
            (em) => em !== this.currentUserEmail,
          );
          prev.likes = updatedLikes;
          return prev;
        });
      });
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
      .get<Blog>(`${environment.apiUrl}/blog/views/${this.id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe(() => {
        this.currentBlog.update((prev) => {
          if (!prev) {
            return prev;
          }
          prev.views += 1;
          return prev;
        });
      });
  }

  deleteBlog() {
    const id = this.currentBlog()?._id;
    const confirmDelete = confirm("Do you really want to delete this blog?");
    if (!confirmDelete) {
      return;
    }
    this.http
      .delete(`${environment.apiUrl}/blog/id/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe(() => {
        this.alertMessageService.setSuccessMessage(
          "Successfully deleted the blog",
        );
        this.router.navigateByUrl("/home");
      });
  }

  addComment() {
    if (!this.commentInput.value) {
      return;
    }
    const newComment: Comment = {
      userEmail: this.currentUserEmail as string,
      comment: this.commentInput.value,
    };
    this.http
      .post<Blog>(`${environment.apiUrl}/blog/comments`, {
        id: this.id,
        comment: this.commentInput.value,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.alertMessageService.setErrorMessage(
              "You must be logged in to add comments",
            );
          }
          if (error.status === 406) {
            this.alertMessageService.setErrorMessage(error.error.error);
          }
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe(() => {
        this.blogComments.update((prev) => {
          if (prev) {
            return [newComment, ...prev];
          }
          return [newComment];
        });
      });
  }

  removeComment(cmt: string) {
    this.http
      .delete<Blog>(`${environment.apiUrl}/blog/comments`, {
        body: {
          id: this.id,
          comment: cmt,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe(() => {
        const prevComments = this.blogComments();
        const updatedComments = prevComments?.filter(
          (comment) => comment.comment !== cmt,
        );
        this.blogComments.set(updatedComments);
      });
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.http
      .get<Blog>(`${environment.apiUrl}/blog/id/${this.id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => new Error(error.statusText)),
        ),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        this.currentBlog.set(res);
        this.blogComments.set(res.comments.reverse());
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
