import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../../core/services/cart';

@Component({
  selector: 'app-paso-pago',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './paso-pago.html',
  styleUrl: './paso-pago.css',
})
export class PasoPagoComponent {
  @Output() confirmar = new EventEmitter<void>();
  @Output() anterior  = new EventEmitter<void>();
  protected cartService = inject(CartService);
}