import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ToastMessageComponent } from "../toast-message/toast-message.component";
import { ToastMessageService } from "../toast-message/toast-message.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, ToastMessageComponent],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toastMessageService = inject(ToastMessageService);

  get isLoggedOut(): boolean {
    return this.authService.currentAuthToken() === null;
  }

  get isCurrentRouteCreate(): boolean {
    return this.router.url === "/create";
  }

  logOut() {
    localStorage.removeItem("TOKEN");
    this.authService.currentAuthToken.set(null);
    this.toastMessageService.alertText.set("Logged out successfully");
    setTimeout(() => this.toastMessageService.alertText.set(""), 3000);
    this.router.navigateByUrl("/login");
  }
}
