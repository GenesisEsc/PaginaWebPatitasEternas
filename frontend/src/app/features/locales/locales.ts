import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Importamos DecimalPipe para formatear precios
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule, FormsModule], // Quitamos DecimalPipe de aquí, lo usaremos directamente en HTML
  providers: [DecimalPipe], // Lo añadimos como proveedor para el componente
  templateUrl: './locales.html',
  styleUrl: './locales.css',
})
export class LocalesComponent {
  precioBase = 30.00;
  precioTotal = 30.00;

  // 1. Perfume (+$5)
  incluyePerfume = false;
  perfumeBase = 'Lavanda'; // Valor por defecto para el azulejo seleccionado
  perfumeColor = '#E6E6FA'; // Color Lavanda por defecto para el selector de color

  // 2. Vela (+$3)
  incluyeVela = false;
  velaAroma = 'Vainilla'; // Valor por defecto
  velaColor = '#f5f5f5'; // Blanco humo por defecto

  // 3. Certificado (+$2)
  incluyeCertificado = false;
  certNombre = '';
  certNacimiento = '';
  certDefuncion = '';

  // Función que suma los precios en tiempo real
  actualizarPrecio() {
    this.precioTotal = this.precioBase;
    if (this.incluyePerfume) this.precioTotal += 5.00;
    if (this.incluyeVela) this.precioTotal += 3.00;
    if (this.incluyeCertificado) this.precioTotal += 2.00;
  }
}