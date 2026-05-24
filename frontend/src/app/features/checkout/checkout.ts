import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { PasoCarritoComponent } from './steps/paso-carrito/paso-carrito';
import { PasoIdentificacionComponent } from './steps/paso-identificacion/paso-identificacion';
import { PasoEntregaComponent } from './steps/paso-entrega/paso-entrega';
import { PasoPagoComponent } from './steps/paso-pago/paso-pago';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    PasoCarritoComponent,
    PasoIdentificacionComponent,
    PasoEntregaComponent,
    PasoPagoComponent
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {
  private router = inject(Router);
  protected cartService = inject(CartService);
  private toastService = inject(ToastService)

  pasoActual = signal(1);

  datosPedido = signal<any>({
    email: '', nombre: '', apellidos: '', cedula: '', telefono: '',
    metodo_envio: 'TIENDA', direccion_envio: ''
  });

  readonly pasos = [
    { numero: 1, label: 'Carrito' },
    { numero: 2, label: 'Identificación' },
    { numero: 3, label: 'Entrega' },
    { numero: 4, label: 'Pago' }
  ];

  irAlPaso(numero: number, datosFormulario?: any): void {
    if (datosFormulario) {
      if (datosFormulario.apellido) {
        datosFormulario.apellidos = datosFormulario.apellido;
      }
      this.datosPedido.update(actual => ({ ...actual, ...datosFormulario }));
    }
    this.pasoActual.set(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmarPedido(): void {
      console.log('Payload enviado:', JSON.stringify(this.datosPedido())); // ← agrega esto

    this.cartService.finalizarCompra(this.datosPedido()).subscribe({
      next: (respuesta: any) => {
        this.cartService.guardarYVaciar();
        this.router.navigate(['/confirmacion']);
      },
      error: (error: any) => {
        console.error('El interceptor ya manejó este error.');
      }
    });
  }
}