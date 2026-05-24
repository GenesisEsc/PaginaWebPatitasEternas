import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Categoria } from '../../core/services/api';
import { ProductCardComponent, Producto } from '../../shared/product-card/product-card';
import { ToastService } from '../../core/services/toast';

const ICONOS_CATEGORIAS: Record<string, string> = {
  'Lácteos':            'bi-cup-straw',
  'Desayuno':           'bi-egg-fried',
  'Despensa':           'bi-basket2',
  'Limpieza':           'bi-droplet',
  'Hogar y Limpieza':   'bi-house-heart',
  'Golosinas y Snacks': 'bi-emoji-smile',
  'Bebidas y Licores':  'bi-cup-hot',
  'Panadería':          'bi-cake2',
  'Mascotas':           'bi-heart',
  'Alacena':            'bi-archive',
  'Electrodomésticos':  'bi-plug',
};


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private apiService   = inject(ApiService);
  private toastService = inject(ToastService);
  private router       = inject(Router);

  destacados = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando   = signal(true);

  ngOnInit(): void {
    this.apiService.getProductos().subscribe({
      next: (data) => {
        this.destacados.set(data.slice(0, 4));
        this.cargando.set(false);
      },
      error: (err) => {
        this.toastService.showError('Error de servidor: No pudo cargar.');
        this.cargando.set(false);
      }
    });

    this.apiService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  getIcono(nombre: string): string {
    return ICONOS_CATEGORIAS[nombre] ?? 'bi-tag';
  }


  irACategoria(cat: Categoria): void {
    this.router.navigate(['/catalogo'], { queryParams: { categoria: cat.nombre } });
  }
}