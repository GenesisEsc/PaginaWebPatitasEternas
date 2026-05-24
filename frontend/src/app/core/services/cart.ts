import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api'; // Asegúrate de que el nombre del archivo sea api.ts

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiService = inject(ApiService);
  private _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  private _ultimoPedido = signal<{items: CartItem[], total: number} | null>(null);
  readonly ultimoPedido = this._ultimoPedido.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  readonly totalPrecio = computed(() =>
    this._items().reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  );

  agregarProducto(producto: Omit<CartItem, 'cantidad'>): void {
    const items = this._items();
    const existente = items.find(i => i.id === producto.id);
    if (existente) {
      this._items.set(items.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      this._items.set([...items, { ...producto, cantidad: 1 }]);
    }
  }

  cambiarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(id);
    } else {
      this._items.set(this._items().map(i => i.id === id ? { ...i, cantidad } : i));
    }
  }

  eliminarProducto(id: number): void {
    this._items.set(this._items().filter(i => i.id !== id));
  }

  vaciarCarrito(): void {
    this._items.set([]);
  }
  // Nuevo método que guarda antes de vaciar
  guardarYVaciar(): void {
  this._ultimoPedido.set({
    items: this._items(),
    total: this.totalPrecio()
  });
  this._items.set([]);
}

  // --- FUNCIÓN QUE FALTABA PARA CONECTAR CON DJANGO ---
  finalizarCompra(datosCliente: any) {
    const detallesFormateados = this._items().map(item => ({
      producto: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));

    const payloadPedido = {
      ...datosCliente,
      total: this.totalPrecio(),
      detalles: detallesFormateados
    };

    return this.apiService.crearPedido(payloadPedido);
  }
}