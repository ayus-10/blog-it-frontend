import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { featherAlertTriangle } from "@ng-icons/feather-icons";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: "./not-found.component.html",
  viewProviders: [provideIcons({ featherAlertTriangle })],
})
export class NotFoundComponent {}
