import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { AlertMessageComponent } from "../alert-message/alert-message.component";
import { AlertMessageService } from "../alert-message/alert-message.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, AlertMessageComponent],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  alertMessageService = inject(AlertMessageService);

  @ViewChild("dropdown") dropdown!: ElementRef;

  get isLoggedOut(): boolean {
    return this.authService.currentAuthToken() === null;
  }

  get isCurrentRouteCreate(): boolean {
    return this.router.url === "/create";
  }

  hideDropdown() {
    const dropdownElement: HTMLElement = this.dropdown.nativeElement;
    dropdownElement.removeAttribute("open");
  }

  logOut() {
    localStorage.removeItem("TOKEN");
    this.authService.currentAuthToken.set(null);
    this.alertMessageService.setSuccessMessage("Logged out successfully");
    this.router.navigateByUrl("/login");
    this.hideDropdown();
  }
}
