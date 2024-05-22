import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ToastMessageService {
  alertText = signal<string>("");
}
