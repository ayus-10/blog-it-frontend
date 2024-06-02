import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from "./auth/auth.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthToken } from "./interfaces/auth-token.interface";
import { environment } from "../environments/environment";
import { catchError, throwError } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
  `,
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    this.http
      .get<AuthToken | null>(`${environment.apiUrl}/auth`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.statusText));
        }),
      )
      .subscribe((res) => this.authService.currentAuthToken.set(res));
  }
}
