import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class AppComponent {
}
