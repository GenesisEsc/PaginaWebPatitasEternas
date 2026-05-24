// src/app/shared/product-card/product-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { ToastService } from '../../core/services/toast';

export interface Producto {
  id:         number;
  nombre:     string;
  precio:     number;
  imagen:     string;    // URL o ruta de la imagen
  categoria:  string;
  descripcion?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input({ required: true }) producto!: Producto;

  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  // Flag para el feedback visual de "añadido"
  recienAgregado = false;

  agregarAlCarrito(): void {
    // Añadir al carrito via el service
    this.cartService.agregarProducto({
      id:     this.producto.id,
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      imagen: this.producto.imagen
    });
    this.toastService.showSuccess(`¡${this.producto.nombre} añadido al carrito!`);

    // Mostrar "¡Añadido!" por 1.5 segundos y volver al estado normal
    this.recienAgregado = true;
    setTimeout(() => { this.recienAgregado = false; }, 1500);
  }
}