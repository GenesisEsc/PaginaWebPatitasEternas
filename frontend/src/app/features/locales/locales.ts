import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart';
import Swal from 'sweetalert2';

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

  // --- NUEVA ESTRUCTURA DE PRECIOS ---
  precioBase = 11.00;
  precioTotal = 11.00;

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
    
    // Sumamos los valores exactos que te indicó tu amiga
    if (this.incluyePerfume) this.precioTotal += 15.00;
    if (this.incluyeVela) this.precioTotal += 9.00;
    if (this.incluyeCertificado) this.precioTotal += 5.00;
  }

  // --- FUNCIÓN PARA AÑADIR AL CARRITO REAL ---
  agregarAlCarrito() {
    let nombreDetallado = 'Kit Memorial';
    if (this.incluyePerfume) nombreDetallado += ` (+ Perfume ${this.perfumeBase})`;
    if (this.incluyeVela) nombreDetallado += ` (+ Vela ${this.velaAroma})`;
    if (this.incluyeCertificado && this.certNombre) nombreDetallado += ` (+ Certificado: ${this.certNombre})`;

    const kitProducto = {
      id: 99, 
      nombre: nombreDetallado,
      precio: this.precioTotal,
      imagen: this.incluyePerfume ? this.imagenPerfume : (this.incluyeVela ? this.imagenVela : '/assets/logo.png')
    };

    this.cartService.agregarProducto(kitProducto); 

    // --- NUEVO SWEETALERT ---
    Swal.fire({
      title: '¡Añadido al Carrito!',
      text: 'Tu Kit Memorial ha sido guardado exitosamente.',
      icon: 'success',
      confirmButtonColor: '#905814', // Color naranja de la marca Patitas Eternas
      confirmButtonText: 'Aceptar'
    });
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