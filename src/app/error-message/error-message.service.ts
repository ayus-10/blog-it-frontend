import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorMessageService {
  alertText = signal<string>("");
}
