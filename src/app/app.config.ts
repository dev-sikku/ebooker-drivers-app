import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AuthInterceptor} from "./shared/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
