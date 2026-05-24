// frontend/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { errorInterceptor } from './core/services/interceptors/error.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 🟢 Agregamos withInterceptors aquí
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};