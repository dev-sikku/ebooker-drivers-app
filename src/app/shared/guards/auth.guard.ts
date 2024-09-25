import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authenticated = authService.isAuthenticated();
  if (!authenticated) {
    await router.navigate(['/auth'], {
      queryParams: {returnUrl: state.url}
    })
  }
  return authenticated;
};
