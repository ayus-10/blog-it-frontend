import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  authService = inject(AuthService);

  get isLoggedOut(): boolean {
    return this.authService.currentAuthToken() === null;
  }

  logOut() {
    localStorage.removeItem("TOKEN");
    this.authService.currentAuthToken.set(null);
  }
}
