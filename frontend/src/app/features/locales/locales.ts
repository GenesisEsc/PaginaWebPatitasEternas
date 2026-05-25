import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DecimalPipe],
  templateUrl: './locales.html',
  styleUrl: './locales.css',
})
export class LocalesComponent {
  // 1. Inyectamos el carrito de tu equipo
  private cartService = inject(CartService);

  precioBase = 30.00;
  precioTotal = 30.00;

  // 1. Perfume
  incluyePerfume = false;
  perfumeBase = 'Lavanda';
  perfumeColor = 'Rojo';

  // 2. Vela
  incluyeVela = false;
  velaAroma = 'Vainilla';
  velaColor = 'Blanco';

  // 3. Certificado
  incluyeCertificado = false;
  certNombre = '';
  certNacimiento = '';
  certDefuncion = '';

  actualizarPrecio() {
    this.precioTotal = this.precioBase;
    if (this.incluyePerfume) this.precioTotal += 5.00;
    if (this.incluyeVela) this.precioTotal += 3.00;
    if (this.incluyeCertificado) this.precioTotal += 2.00;
  }

  // --- FUNCIÓN PARA AÑADIR AL CARRITO REAL ---
  agregarAlCarrito() {
    // Armamos un título largo para que se vea todo lo que eligió en el carrito
    let nombreDetallado = 'Kit Memorial';
    if (this.incluyePerfume) nombreDetallado += ` (+ Perfume ${this.perfumeBase})`;
    if (this.incluyeVela) nombreDetallado += ` (+ Vela ${this.velaAroma})`;
    if (this.incluyeCertificado && this.certNombre) nombreDetallado += ` (+ Certificado: ${this.certNombre})`;

    // Creamos el producto respetando exactamente la interfaz CartItem de tus compañeros
    const kitProducto = {
      id: 99, // ID numérico único
      nombre: nombreDetallado,
      precio: this.precioTotal,
      // Si eligió algo, mostramos esa foto, sino mandamos el logo de Tuti por defecto
      imagen: this.incluyePerfume ? this.imagenPerfume : (this.incluyeVela ? this.imagenVela : '/assets/logo-tuti.png')
    };

    // Llamamos a la función exacta de tu archivo cart.ts
    this.cartService.agregarProducto(kitProducto); 

    // Confirmación
    alert('¡Tu Kit Memorial Personalizado ha sido añadido al carrito con éxito!');
  }

  // --- RUTAS DINÁMICAS PARA LAS IMÁGENES ---
  get imagenPerfume(): string {
    switch(this.perfumeColor) {
      case 'Morado': return '/assets/perfumes/morado.png';
      case 'Azul': return '/assets/perfumes/azul.png';
      case 'Verde': return '/assets/perfumes/verde.png';
      case 'Amarillo': return '/assets/perfumes/amarillo.png';
      case 'Rojo': return '/assets/perfumes/rojo.png';
      case 'Tomate': return '/assets/perfumes/tomate.png';
      default: return '/assets/perfumes/default.png';
    }
  }

  get imagenVela(): string {
    switch(this.velaColor) {
      case 'Blanco': return '/assets/velas/blanca.png';
      case 'Verde': return '/assets/velas/verde.png';
      case 'Tomate': return '/assets/velas/tomate.png';
      case 'Azul': return '/assets/velas/azul.png';
      case 'Morado': return '/assets/velas/morado.png';
      case 'Rosado': return '/assets/velas/rosado.png';
      case 'Negro': return '/assets/velas/negro.png';
      default: return '/assets/velas/default.png';
    }
  }
}