import { Injectable, signal } from "@angular/core";
import { AlertMessage } from "./alert-message.interface";

@Injectable({
  providedIn: "root",
})
export class AlertMessageService {
  alertMessage = signal<AlertMessage | undefined>(undefined);
}
