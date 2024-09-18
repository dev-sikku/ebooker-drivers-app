import {Routes} from '@angular/router';
import {AuthComponent} from "./pages/auth/auth.component";
import {authGuard} from "./shared/guards/auth.guard";
import {AppComponent} from "./app.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: AppComponent,
  }, {
    path: 'auth',
    pathMatch: 'full',
    component: AuthComponent,
  }];
