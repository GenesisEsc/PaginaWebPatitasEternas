import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Mantenemos los 3 de Génesis
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html', // Versión HEAD
  styleUrl: './navbar.css'      // Versión HEAD
})
export class NavbarComponent {
  protected readonly cartService = inject(CartService);
  private router = inject(Router); 

  buscar(termino: string) {
    // elimina cualquier símbolo raro y deja solo letras y números
    const terminoLimpio = termino.replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]/g, '');
    
    if (terminoLimpio.trim()) {
      this.router.navigate(['/catalogo'], { queryParams: { search: terminoLimpio } });
    }
  }
}