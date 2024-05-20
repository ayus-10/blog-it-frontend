import { Injectable, signal } from "@angular/core";
import { AuthToken } from "../interfaces/auth-token.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentAuthToken = signal<AuthToken | null | undefined>(undefined);
}
