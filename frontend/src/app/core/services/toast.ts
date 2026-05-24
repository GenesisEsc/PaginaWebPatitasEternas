import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private idCounter = 0;

  showSuccess(mensaje: string) { this.addToast(mensaje, 'success'); }
  showError(mensaje: string) { this.addToast(mensaje, 'error'); }

  private addToast(mensaje: string, tipo: 'success' | 'error') {
    const id = this.idCounter++;
    this.toasts.update(t => [...t, { id, mensaje, tipo }]);
    
    // Auto-eliminar el toast después de 3 segundos
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}