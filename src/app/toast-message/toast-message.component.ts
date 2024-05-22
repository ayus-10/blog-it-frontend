import { Component, inject } from "@angular/core";
import { ToastMessageService } from "./toast-message.service";

@Component({
  selector: "app-toast-message",
  standalone: true,
  imports: [],
  templateUrl: "./toast-message.component.html",
})
export class ToastMessageComponent {
  toastMessageService = inject(ToastMessageService);
  alertText: string = this.toastMessageService.alertText();
}
