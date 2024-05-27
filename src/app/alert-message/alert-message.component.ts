import { Component, inject } from "@angular/core";
import { AlertMessageService } from "./alert-message.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-alert-message",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./alert-message.component.html",
})
export class AlertMessageComponent {
  alertMessageService = inject(AlertMessageService);

  get alertText() {
    return this.alertMessageService.alertMessage()?.text;
  }

  get alertType() {
    return this.alertMessageService.alertMessage()?.type;
  }
}
