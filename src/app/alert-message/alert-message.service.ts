import { Injectable, signal } from "@angular/core";
import { AlertMessage } from "../interfaces/alert-message.interface";

@Injectable({
  providedIn: "root",
})
export class AlertMessageService {
  alertMessage = signal<AlertMessage | undefined>(undefined);

  setAlertMessage(alertText: string, alertType: "success" | "error") {
    this.alertMessage.set({
      text: alertText,
      type: alertType,
    });
    setTimeout(() => {
      this.alertMessage.set(undefined);
    }, 3000);
  }

  setErrorMessage(errorText: string) {
    this.setAlertMessage(errorText, "error");
  }

  setSuccessMessage(successText: string) {
    this.setAlertMessage(successText, "success");
  }
}
