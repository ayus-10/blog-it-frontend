import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthFormService {
  loading = signal(false);
}
