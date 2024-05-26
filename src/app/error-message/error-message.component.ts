import { Component, inject } from "@angular/core";
import { ErrorMessageService } from "./error-message.service";

@Component({
  selector: "app-error-message",
  standalone: true,
  imports: [],
  templateUrl: "./error-message.component.html",
})
export class ErrorMessageComponent {
  errorMessageService = inject(ErrorMessageService);
  alertText: string = this.errorMessageService.alertText();
}
