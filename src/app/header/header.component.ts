import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { ErrorMessageService } from "../error-message/error-message.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, ErrorMessageComponent],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  errorMessageService = inject(ErrorMessageService);

  get isLoggedOut(): boolean {
    return this.authService.currentAuthToken() === null;
  }

  get isCurrentRouteCreate(): boolean {
    return this.router.url === "/create";
  }

  logOut() {
    localStorage.removeItem("TOKEN");
    this.authService.currentAuthToken.set(null);
    this.errorMessageService.alertText.set("Logged out successfully");
    setTimeout(() => this.errorMessageService.alertText.set(""), 3000);
    this.router.navigateByUrl("/login");
  }
}
