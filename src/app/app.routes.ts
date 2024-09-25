import {Routes} from '@angular/router';
import {AuthComponent} from "./pages/auth/auth.component";
import {authGuard} from "./shared/guards/auth.guard";
import {BookingComponent} from "./pages/booking/booking.component";

export const routes: Routes = [
  {
    path: 'auth',
    pathMatch: 'full',
    component: AuthComponent
  },
  {
    path: 'booking',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: BookingComponent
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: BookingComponent
  }];
