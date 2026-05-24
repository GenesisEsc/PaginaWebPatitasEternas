// frontend/src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
// Asegúrate de que la ruta al servicio Toast de Génesis sea correcta
import { ToastService } from '../toast'; 

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensajeError = 'Ocurrió un error inesperado al conectar con el servidor.';

      // Si el error viene de Django DRF (suele ser un objeto JSON)
      if (error.error && typeof error.error === 'object') {
        // Extraemos el primer mensaje de error que Django envíe
        const primeraLlave = Object.keys(error.error)[0];
        if (primeraLlave && error.error[primeraLlave]) {
          const detalle = error.error[primeraLlave];
          mensajeError = Array.isArray(detalle) ? detalle[0] : detalle;
        }
      } else if (error.error && typeof error.error === 'string') {
        mensajeError = error.error;
      }

      // Disparamos el Toast rojo de Génesis
      toastService.showError(mensajeError);
      
      return throwError(() => error);
    })
  );
};