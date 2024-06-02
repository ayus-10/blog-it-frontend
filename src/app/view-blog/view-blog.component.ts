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

  currentBlog = signal<Blog | undefined>(undefined);

  imageUrl = computed(() => {
    return `${environment.apiUrl}/${this.currentBlog()?.imageFile}`;
  });

  get blog(): Blog {
    return this.currentBlog() as Blog;
  }

  liked = signal(false);

  onLikeClick() {
    this.liked.set(true);
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
      });
  }
}
