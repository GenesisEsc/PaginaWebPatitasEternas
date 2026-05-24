import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart';

@Component({
  selector: 'app-paso-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './paso-carrito.html',
  styleUrl: './paso-carrito.css'
})
export class PasoCarritoComponent {
  @Output() siguiente = new EventEmitter<void>();
  protected cartService = inject(CartService);
}